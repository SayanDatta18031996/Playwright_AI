/**
 * Test Case: Invalid Login Flow
 *
 * Description: Verify login failure with invalid customer credentials and assert expected warning message.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and navigate to My Account -> Login
 * 2) Enter invalid credentials and submit the login form
 * 3) Verify that authentication fails and expected warning is displayed
 * 4) Verify that the customer is not authenticated
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { logger } from '../../utils/logger';

test('Invalid login flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
}) => {
    logger.info('=== Starting Invalid Login Flow Test ===');
    const { username, password } = RandomDataUtil.generateInvalidLoginPayload();
    const invalidEmail = `${username}_${Date.now()}@invalidexample.com`;
    logger.info(`Generated random invalid credentials: email="${invalidEmail}"`);

    await test.step('1) Open application and navigate to My Account -> Login', async () => {
        logger.info('Step 1: Checking Home page and navigating to Login page');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
        logger.info('Step 1: Navigated to Login page successfully');
    });

    await test.step('2) Enter invalid credentials and submit login form', async () => {
        logger.info(`Step 2: Submitting login with invalid email="${invalidEmail}"`);
        await loginPage.login(invalidEmail, password);
    });

    await test.step('3) Verify that authentication fails with expected warning message', async () => {
        logger.info('Step 3: Checking for warning message');
        const warning = await loginPage.getWarningMessage();
        expect(warning).toContain('Warning: No match for E-Mail Address and/or Password.');
        logger.info(`Step 3: Confirmed expected warning message: "${warning.trim()}"`);
    });

    await test.step('4) Verify that the customer is not authenticated', async () => {
        logger.info('Step 4: Ensuring My Account page is not displayed');
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeFalsy();
        logger.info('Step 4: User is confirmed NOT authenticated');
    });

    logger.info('✅ Invalid Login Flow completed successfully!');
});

