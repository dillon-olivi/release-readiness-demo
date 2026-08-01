import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('moves a release from blocked to ready through the critical workflow', async ({ page }) => {
  await expect(page.getByTestId('status')).toHaveText('BLOCKED');
  await expect(page.getByTestId('failed-tests')).toHaveText('1');
  await expect(page.getByTestId('critical-bugs')).toHaveText('1');

  await page.getByRole('button', { name: 'Run smoke suite' }).click();
  await expect(page.getByTestId('failed-tests')).toHaveText('0');
  await expect(page.getByTestId('message')).toContainText('12/12');
  await expect(page.getByTestId('status')).toHaveText('BLOCKED');

  await page.getByRole('button', { name: 'Resolve critical bug' }).click();
  await expect(page.getByTestId('critical-bugs')).toHaveText('0');
  await expect(page.getByTestId('status')).toHaveText('READY');
  await expect(page.getByText('APPROVED TO DEPLOY')).toBeVisible();
});

test('reset restores the initial blocked state', async ({ page }) => {
  await page.getByRole('button', { name: 'Run smoke suite' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();

  await expect(page.getByTestId('failed-tests')).toHaveText('1');
  await expect(page.getByTestId('critical-bugs')).toHaveText('1');
  await expect(page.getByTestId('status')).toHaveText('BLOCKED');
});
