import { execFile } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { copyFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// Claude Code and Codex send `session_id` and `prompt` on UserPromptSubmit, and
// Gemini CLI sends the same fields on BeforeAgent; the alternates keep the hook
// working if a tool renames them.
const SESSION_FIELDS = ['session_id', 'sessionId', 'conversation_id'];
const PROMPT_FIELDS = ['prompt', 'user_prompt', 'userPrompt'];
const TRANSCRIPT_FIELDS = ['transcript_path', 'transcriptPath'];
const CWD_FIELDS = ['cwd'];

const run = promisify(execFile);

function firstString(input, fields) {
  for (const field of fields) {
    if (typeof input?.[field] === 'string' && input[field].trim()) return input[field];
  }
  return '';
}

export function parseDrift(prompt) {
  const match = /^\s*!drift(?:\s+(\S+))?(?:\s+([\s\S]*))?$/.exec(prompt);
  if (!match) return null;
  return {
    category: match[1]?.toLowerCase() ?? null,
    note: match[2]?.trim() || null,
  };
}

function sessionName(sessionId) {
  const safe = sessionId.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '_');
  return safe || 'unknown';
}

async function gitState(cwd) {
  const git = async (...args) => {
    try {
      return (await run('git', ['-C', cwd, ...args])).stdout.trim() || null;
    } catch {
      return null;
    }
  };
  const commit = await git('rev-parse', 'HEAD');
  if (!commit) return null;
  return {
    commit,
    branch: await git('rev-parse', '--abbrev-ref', 'HEAD'),
    dirty: (await git('status', '--porcelain')) !== null,
  };
}

// Transcripts expire, so keep a copy of what the agent had read at this point.
async function snapshotTranscript(root, transcriptPath, directory, name) {
  if (!transcriptPath) return null;
  // Claude and Codex write JSONL transcripts; Gemini CLI writes JSON.
  const target = join(directory, `${name}${extname(transcriptPath) || '.jsonl'}`);
  try {
    await copyFile(transcriptPath, target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  return relative(root, target).split(sep).join('/');
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
  const name = sessionName(sessionId);
  const directory = join(root, '.icm', 'drift');
  const path = join(directory, `${name}.json`);
  const snapshots = join(directory, name);
  await mkdir(snapshots, { recursive: true });

  const previous = await readCounter(path);
  const count = (previous?.count ?? 0) + 1;
  const transcriptPath = firstString(input, TRANSCRIPT_FIELDS) || null;
  const cwd = firstString(input, CWD_FIELDS) || root;
  const counter = {
    sessionId,
    count,
    events: [
      ...(previous?.events ?? []),
      {
        at: now.toISOString(),
        category: drift.category,
        note: drift.note,
        cwd,
        git: await gitState(cwd),
        transcriptPath,
        transcriptSnapshot: await snapshotTranscript(root, transcriptPath, snapshots, String(count)),
      },
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

// Echo the event that fired so one script serves UserPromptSubmit (Claude, Codex)
// and BeforeAgent (Gemini CLI).
export function hookOutput(input, counter) {
  return {
    hookSpecificOutput: {
      hookEventName: firstString(input, ['hook_event_name', 'hookEventName']) || 'UserPromptSubmit',
      additionalContext: driftContext(counter),
    },
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// Compare real paths: a project dir behind a symlink would otherwise skip the hook.
const invokedPath = process.argv[1] ? realpathSync(resolve(process.argv[1])) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  try {
    const input = JSON.parse(await readStdin());
    const counter = await recordDrift(root, input);
    if (counter) console.log(JSON.stringify(hookOutput(input, counter)));
  } catch (error) {
    // A broken counter must never block the human's prompt.
    console.error(`drift-hook: ${error.message}`);
    process.exitCode = 1;
  }
}
