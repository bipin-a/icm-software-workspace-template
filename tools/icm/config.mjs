export const SUPPORTED_ENVIRONMENT_PROBES = Object.freeze([
  'node-version',
  'platform',
  'architecture',
  'os-release',
]);

export function environmentProbeConfigurationError(probes) {
  const supported = new Set(SUPPORTED_ENVIRONMENT_PROBES);
  if (
    !Array.isArray(probes ?? [])
    || (probes ?? []).some((probe) => !supported.has(probe))
    || new Set(probes ?? []).size !== (probes ?? []).length
  ) return 'environment probes must contain unique supported probe names';
  return null;
}

export function candidateGateConfigurationErrors(gate) {
  const failures = [];
  if (!gate || typeof gate !== 'object' || Array.isArray(gate)) {
    return ['candidateGate must be an object'];
  }
  const supportedKeys = new Set(['enabled', 'phases', 'evidence', 'environmentProbes']);
  for (const key of Object.keys(gate)) {
    if (!supportedKeys.has(key)) failures.push(`unknown key ${key}`);
  }
  if (typeof gate.enabled !== 'boolean') failures.push('enabled must be a boolean');
  if (!Array.isArray(gate.phases)) {
    failures.push('phases must be a list');
  } else {
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
      ) failures.push('each phase requires a name and non-empty command array');
      else if (names.has(phase.name)) failures.push(`duplicate phase ${phase.name}`);
      else names.add(phase.name);
    }
  }
  if (!Array.isArray(gate.evidence)) {
    failures.push('evidence must be a list');
  } else {
    const names = new Set();
    for (const evidence of gate.evidence) {
      if (
        !/^[a-z0-9][a-z0-9-]*$/.test(evidence?.name ?? '')
        || !/^[A-Z][A-Z0-9_]*$/.test(evidence?.environmentVariable ?? '')
        || (evidence.required !== undefined && typeof evidence.required !== 'boolean')
      ) failures.push('each evidence item requires a name and uppercase environmentVariable');
      else if (names.has(evidence.name)) failures.push(`duplicate evidence ${evidence.name}`);
      else names.add(evidence.name);
    }
  }
  const environmentProbeError = environmentProbeConfigurationError(gate.environmentProbes);
  if (environmentProbeError) failures.push(environmentProbeError);
  return failures;
}
