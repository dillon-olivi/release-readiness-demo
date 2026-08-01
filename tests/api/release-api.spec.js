import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const response = await request.post('/api/reset');
  expect(response.ok()).toBeTruthy();
});

test('returns the current release decision and contract', async ({ request }) => {
  const response = await request.get('/api/release');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const release = await response.json();
  expect(release).toMatchObject({
    version: '2.4.0',
    status: 'BLOCKED',
    criticalBugs: 1,
    passRate: 89
  });
  expect(release.tests.failed).toBe(1);
});

test('accepts valid results but keeps the release blocked by a critical bug', async ({ request }) => {
  const response = await request.post('/api/test-results', {
    data: { passed: 25, failed: 0, skipped: 0 }
  });

  expect(response.status()).toBe(200);
  const release = await response.json();
  expect(release.passRate).toBe(100);
  expect(release.status).toBe('BLOCKED');
});

test('rejects malformed and negative test results', async ({ request }) => {
  const response = await request.post('/api/test-results', {
    data: { passed: 5, failed: -1, skipped: 0 }
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain('non-negative integers');
});
