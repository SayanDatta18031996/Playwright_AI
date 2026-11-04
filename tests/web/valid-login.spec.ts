/**
 * Test Case: Valid Login Flow
 *
 * Description: Validate successful customer login using configured test credentials.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and navigate to My Account -> Login
 * 2) Verify that the login page is displayed
 * 3) Enter valid customer credentials and submit the login form
 * 4) Verify successful authentication and redirection to My Account section
 * 5) Verify that the account dashboard/navigation is visible
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { logger } from '../../utils/logger';

test('Valid login flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
}) => {
    logger.info('=== Starting Valid Login Flow Test ===');
    const { email, password } = Helper.getLoginDetails();
    logger.info(`Using test credentials: email="${email}"`);

    await test.step('1) Open application and navigate to My Account -> Login', async () => {
        logger.info('Step 1: Checking if Home page exists and clicking Login');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
    });

    await test.step('2) Verify that the login page is displayed', async () => {
        logger.info('Step 2: Verifying that Login page is displayed');
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
        logger.info('Step 2: Login page confirmed visible');
    });

    await test.step('3) Enter valid customer credentials and submit login form', async () => {
        logger.info(`Step 3: Submitting credentials for user: ${email}`);
        await loginPage.login(email, password);
    });

    await test.step('4) Verify successful authentication and redirection to My Account section', async () => {
        logger.info('Step 4: Verifying My Account page presence');
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
    });

    await test.step('5) Verify that the account dashboard is visible', async () => {
        logger.info('Step 5: Verifying My Account heading');
        const heading = await myAccountPage.getPageHeading();
        expect(heading.trim()).toBe('My Account');
        logger.info(`Step 5: Account heading verified as "${heading.trim()}"`);
    });

    logger.info('✅ Valid Login Flow completed successfully!');
});
