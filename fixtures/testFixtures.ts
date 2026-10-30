import { test as base } from '@playwright/test';

type CustomFixtures = {
  authToken: string;
};

export const test = base.extend<CustomFixtures>({
  authToken: async ({}, use) => {
    // Placeholder fixture for authentication tokens or context setup
    const token = 'sample-auth-token';
    await use(token);
  },
});

export { expect } from '@playwright/test';

