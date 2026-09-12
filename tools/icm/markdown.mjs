// The documented frontmatter subset uses two-space mappings and lists,
// plain or quoted scalars, and inline scalar lists. It is not a general YAML parser.
function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null' || trimmed === '~') return null;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return [];
    return inside.split(',').map((entry) => parseScalar(entry));
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) return trimmed.slice(1, -1);
  return trimmed;
}

function parseYamlSubset(source) {
  const lines = source.split(/\r?\n/).flatMap((line) => {
    if (!line.trim() || /^\s*#/.test(line)) return [];
    const indent = line.match(/^ */)[0].length;
    if (indent % 2 !== 0) throw new Error('frontmatter indentation must use two-space levels');
    return [{ indent, content: line.trim() }];
  });

  const parseNode = (start, indent) => {
    if (lines[start]?.content.startsWith('- ')) return parseArray(start, indent);
    return parseObject(start, indent);
  };
  const parseObject = (start, indent) => {
    const value = {};
    let index = start;
    while (index < lines.length && lines[index].indent === indent && !lines[index].content.startsWith('- ')) {
      const match = lines[index].content.match(/^([^:]+):(.*)$/);
      if (!match) throw new Error(`invalid frontmatter entry: ${lines[index].content}`);
      const key = match[1].trim();
      if (Object.hasOwn(value, key)) throw new Error(`duplicate frontmatter key: ${key}`);
      const rest = match[2].trim();
      if (rest) {
        value[key] = parseScalar(rest);
        index += 1;
      } else if (lines[index + 1] && lines[index + 1].indent > indent) {
        const nested = parseNode(index + 1, lines[index + 1].indent);
        value[key] = nested.value;
        index = nested.index;
      } else {
        value[key] = '';
        index += 1;
      }
    }
    return { value, index };
  };
  const parseArray = (start, indent) => {
    const value = [];
    let index = start;
    while (index < lines.length && lines[index].indent === indent && lines[index].content.startsWith('- ')) {
      const rest = lines[index].content.slice(2).trim();
      const mapping = rest.match(/^([^:]+):(.*)$/);
      if (!mapping) {
        value.push(parseScalar(rest));
        index += 1;
        continue;
      }
      const item = { [mapping[1].trim()]: parseScalar(mapping[2].trim()) };
      index += 1;
      if (index < lines.length && lines[index].indent > indent) {
        const nested = parseObject(index, lines[index].indent);
        Object.assign(item, nested.value);
        index = nested.index;
      }
      value.push(item);
    }
    return { value, index };
  };

  if (lines.length === 0) return {};
  if (lines[0].indent !== 0) throw new Error('frontmatter must start at column one');
  const parsed = parseNode(0, 0);
  if (parsed.index !== lines.length) throw new Error('unparsed frontmatter lines');
  return parsed.value;
}

export function parseFrontmatter(path, body) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path} is missing YAML frontmatter`);
  try {
    return parseYamlSubset(match[1]);
  } catch (error) {
    throw new Error(`${path} has invalid YAML frontmatter: ${error.message}`);
  }
}

export function headingSection(body, wanted) {
  const headings = [...body.matchAll(/^(#{1,6}) (.+)$/gm)];
  const index = headings.findIndex((heading) => (
    heading[2] === wanted || heading[2].startsWith(`${wanted} —`)
  ));
  if (index < 0) return null;
  const current = headings[index];
  const next = headings.slice(index + 1).find(
    (heading) => heading[1].length <= current[1].length,
  );
  return body.slice(current.index, next?.index);
}
