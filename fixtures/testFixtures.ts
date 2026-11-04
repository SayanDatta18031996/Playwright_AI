/**
 * @file testFixtures.ts
 * @description Playwright custom fixtures for API test authentication tokens and context setup.
 *
 * Extend this file to add shared fixtures needed across API or integration tests,
 * such as authentication tokens, pre-seeded database state, or shared API clients.
 *
 * Usage in tests:
 *   import { test, expect } from '../../fixtures/testFixtures';
 *   test('api test', async ({ authToken }) => { ... });
 */

import { test as base } from '@playwright/test';

/**
 * Type definition for custom test-level fixtures.
 */
type CustomFixtures = {
  /** A pre-fetched authentication token for API requests */
  authToken: string;
};

/**
 * Extended test object with authentication token fixture.
 * Replace the placeholder token with actual auth logic (e.g. a login API call).
 */
export const test = base.extend<CustomFixtures>({
  authToken: async ({}, use) => {
    // TODO: Replace with real authentication logic, e.g. call login API and extract token
    // Placeholder fixture for authentication tokens or context setup
    const token = 'sample-auth-token';
    await use(token);
  },
});

export { expect } from '@playwright/test';
