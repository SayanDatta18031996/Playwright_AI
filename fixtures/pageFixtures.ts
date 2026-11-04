/**
 * @file pageFixtures.ts
 * @description Playwright custom test fixtures for Page Object Model (POM) pages.
 *
 * This file extends Playwright's base `test` with pre-instantiated page objects.
 * Each fixture provides a ready-to-use page instance for a specific UI section.
 *
 * The `homePage` fixture automatically navigates to the application URL before each test.
 * The URL is read from the WEB_APP_URL environment variable (set via .env or GitHub Secrets).
 *
 * Usage in tests:
 *   import { test, expect } from '../../fixtures/pageFixtures';
 *   test('my test', async ({ homePage, loginPage }) => { ... });
 */

import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountSuccessPage } from '../pages/AccountSuccessPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { logger } from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

/**
 * Application base URL.
 * Falls back to the Naveen Automation Labs OpenCart demo if not set in .env.
 */
const APP_URL = process.env.WEB_APP_URL || 'https://naveenautomationlabs.com/opencart';

/**
 * Type definition for all page fixture properties available in tests.
 */
type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    accountSuccessPage: AccountSuccessPage;
    myAccountPage: MyAccountPage;
    logoutPage: LogoutPage;
    loginPage: LoginPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    shoppingCartPage: ShoppingCartPage;
};

/**
 * Extended test object with all page fixtures pre-wired.
 * Import this `test` in every spec file instead of the default Playwright `test`.
 */
export const test = base.extend<PageFixtures>({
    /**
     * Navigates to the app home page and returns a HomePage instance.
     * This fixture runs before the test and disposes after.
     */
    homePage: async ({ page }, use) => {
        logger.info(`Navigating to application URL: ${APP_URL}`);
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },

    /** Provides a RegisterPage instance (no navigation — user must navigate first) */
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    /** Provides an AccountSuccessPage instance */
    accountSuccessPage: async ({ page }, use) => {
        await use(new AccountSuccessPage(page));
    },

    /** Provides a MyAccountPage instance */
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },

    /** Provides a LogoutPage instance */
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },

    /** Provides a LoginPage instance */
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    /** Provides a SearchResultsPage instance */
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },

    /** Provides a ProductPage instance */
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    /** Provides a ShoppingCartPage instance */
    shoppingCartPage: async ({ page }, use) => {
        await use(new ShoppingCartPage(page));
    },
});

export { expect } from '@playwright/test';
