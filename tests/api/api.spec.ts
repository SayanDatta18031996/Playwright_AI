import { test, expect } from '../../fixtures/testFixtures';
import { logger } from '../../utils/logger';

test.describe('API Tests', () => {
  test('sample API test placeholder @master', async ({ request }) => {
    logger.info('=== Starting Sample API Test ===');
    logger.info('Sending GET request to https://playwright.dev/');
    const response = await request.get('https://playwright.dev/');
    logger.info(`Received response with status: ${response.status()}`);
    expect(response.status()).toBe(200);
    logger.info('✅ Sample API test completed successfully!');
  });
});

