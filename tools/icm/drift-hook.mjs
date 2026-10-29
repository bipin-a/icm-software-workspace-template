import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Claude Code and Codex both send `session_id` and `prompt` on UserPromptSubmit;
// the alternates keep the hook working if either tool renames them.
const SESSION_FIELDS = ['session_id', 'sessionId', 'conversation_id'];
const PROMPT_FIELDS = ['prompt', 'user_prompt', 'userPrompt'];

function firstString(input, fields) {
  for (const field of fields) {
    if (typeof input?.[field] === 'string' && input[field].trim()) return input[field];
  }
  return '';
}

export function parseDrift(prompt) {
  const match = /^\s*!drift(?:\s+(\S+))?(?:\s|$)/.exec(prompt);
  if (!match) return null;
  return { category: match[1]?.toLowerCase() ?? null };
}

function sessionFileName(sessionId) {
  const safe = sessionId.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '_');
  return `${safe || 'unknown'}.json`;
}

async function readCounter(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}

export async function recordDrift(root, input, now = new Date()) {
  const drift = parseDrift(firstString(input, PROMPT_FIELDS));
  if (!drift) return null;

  const sessionId = firstString(input, SESSION_FIELDS) || 'unknown';
  const directory = join(root, '.icm', 'drift');
  const path = join(directory, sessionFileName(sessionId));
  await mkdir(directory, { recursive: true });

  const previous = await readCounter(path);
  const counter = {
    sessionId,
    count: (previous?.count ?? 0) + 1,
    events: [
      ...(previous?.events ?? []),
      { at: now.toISOString(), category: drift.category },
    ],
  };

  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(counter, null, 2)}\n`);
  await rename(temporary, path);
  return counter;
}

export function driftContext(counter) {
  const category = counter.events.at(-1)?.category;
  return `drift: ${counter.count} this session${category ? ` (latest: ${category})` : ''}`;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  try {
    const counter = await recordDrift(root, JSON.parse(await readStdin()));
    if (counter) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: driftContext(counter),
        },
      }));
    }
  } catch (error) {
    // A broken counter must never block the human's prompt.
    console.error(`drift-hook: ${error.message}`);
    process.exitCode = 1;
  }
}
