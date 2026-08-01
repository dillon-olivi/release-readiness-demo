import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReleaseSummary, isValidTestResult } from '../../src/public/release-logic.js';

test('blocks a release when tests fail', () => {
  const result = calculateReleaseSummary({
    version: '1.0.0',
    tests: { passed: 9, failed: 1, skipped: 0 },
    criticalBugs: 0
  });

  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.passRate, 90);
});

test('marks a release ready when every quality gate passes', () => {
  const result = calculateReleaseSummary({
    version: '1.0.0',
    tests: { passed: 12, failed: 0, skipped: 0 },
    criticalBugs: 0
  });

  assert.equal(result.status, 'READY');
  assert.equal(result.passRate, 100);
});

test('validates API test-result payloads', () => {
  assert.equal(isValidTestResult({ passed: 2, failed: 0, skipped: 1 }), true);
  assert.equal(isValidTestResult({ passed: 2, failed: -1, skipped: 1 }), false);
  assert.equal(isValidTestResult({ passed: '2', failed: 0, skipped: 1 }), false);
});
