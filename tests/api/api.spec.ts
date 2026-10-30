import { test, expect } from '../../fixtures/testFixtures';

test.describe('API Tests', () => {
  test('sample API test placeholder @master', async ({ request }) => {
    const response = await request.get('https://playwright.dev/');
    expect(response.status()).toBe(200);
  });
});

