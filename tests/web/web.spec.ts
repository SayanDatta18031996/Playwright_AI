import { test, expect } from '../../fixtures/testFixtures';

test.describe('Web UI Tests', () => {
  test('sample web test placeholder @master', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

