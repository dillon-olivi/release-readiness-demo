/**
 * Shared quality-gate rules used by both the live browser demo and Node.js API.
 */
export function calculateReleaseSummary(release) {
  const { passed, failed, skipped } = release.tests;
  const totalTests = passed + failed + skipped;
  const executedTests = passed + failed;
  const passRate = executedTests === 0 ? 0 : Math.round((passed / executedTests) * 100);
  const ready = failed === 0 && release.criticalBugs === 0 && passRate >= 90;

  return {
    ...release,
    totalTests,
    passRate,
    status: ready ? 'READY' : 'BLOCKED'
  };
}

export function isValidTestResult(value) {
  if (!value || typeof value !== 'object') return false;

  return ['passed', 'failed', 'skipped'].every(
    (key) => Number.isInteger(value[key]) && value[key] >= 0
  );
}
