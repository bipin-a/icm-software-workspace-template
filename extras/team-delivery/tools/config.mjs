export function candidateGateConfigurationErrors(gate) {
  const failures = [];
  if (!gate || typeof gate !== 'object' || Array.isArray(gate)) {
    return ['candidateGate must be an object'];
  }
  const supportedKeys = new Set(['enabled', 'phases']);
  for (const key of Object.keys(gate)) {
    if (!supportedKeys.has(key)) failures.push(`unknown key ${key}`);
  }
  if (typeof gate.enabled !== 'boolean') failures.push('enabled must be a boolean');
  if (!Array.isArray(gate.phases)) {
    failures.push('phases must be a list');
    return failures;
  }
  if (gate.enabled === true && gate.phases.length === 0) {
    failures.push('an enabled gate requires at least one phase');
  }
  const names = new Set();
  for (const phase of gate.phases) {
    if (
      typeof phase?.name !== 'string'
      || phase.name.length === 0
      || !Array.isArray(phase.command)
      || phase.command.length === 0
      || phase.command.some((part) => typeof part !== 'string' || part.length === 0)
    ) {
      failures.push('each phase requires a name and non-empty command array');
    } else if (names.has(phase.name)) {
      failures.push(`duplicate phase ${phase.name}`);
    } else {
      names.add(phase.name);
    }
  }
  return failures;
}
