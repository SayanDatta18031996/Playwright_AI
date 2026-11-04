/**
 * Test Case: Logout Flow
 *
 * Description: Validate customer logout, logout confirmation page, and ensure authenticated options are removed.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open application and log in using valid customer credentials
 * 2) Verify successful authentication
 * 3) Navigate to My Account -> Logout and click Logout
 * 4) Verify logout confirmation page is displayed
 * 5) Click Continue and verify redirection to homepage
 * 6) Verify authenticated account options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { logger } from '../../utils/logger';

test('Logout flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
    logoutPage,
}) => {
    logger.info('=== Starting Logout Flow Test ===');
    const { email, password } = Helper.getLoginDetails();
    logger.info(`Using test credentials for user: ${email}`);

    await test.step('1) Open application and log in using valid customer credentials', async () => {
        logger.info('Step 1: Checking Home page, navigating to Login, and submitting credentials');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('2) Verify successful authentication', async () => {
        logger.info('Step 2: Verifying user is logged in via My Account page');
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
        logger.info('Step 2: User successfully authenticated');
    });

    await test.step('3) Navigate to account logout option and click Logout', async () => {
        logger.info('Step 3: Clicking Logout link in My Account menu');
        await homePage.clickLogout();
    });

    await test.step('4) Verify logout confirmation page is displayed', async () => {
        logger.info('Step 4: Checking Account Logout confirmation heading');
        const isLogoutDisplayed = await logoutPage.isLogoutPageExists();
        expect(isLogoutDisplayed).toBeTruthy();
        const heading = await logoutPage.getPageHeading();
        expect(heading.trim()).toBe('Account Logout');
        logger.info(`Step 4: Logout confirmed with heading "${heading.trim()}"`);
    });

    await test.step('5) Click Continue and verify expected redirection', async () => {
        logger.info('Step 5: Clicking Continue on Logout page and verifying redirection to Home');
        await logoutPage.clickContinue();
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        logger.info('Step 5: Redirection to Home page confirmed');
    });

    await test.step('6) Verify authenticated account options are no longer available', async () => {
        logger.info('Step 6: Verifying Login option is visible and Logout option is hidden');
        const isLoginVisible = await homePage.isLoginOptionVisible();
        expect(isLoginVisible).toBeTruthy();
        const isLogoutVisible = await homePage.isLogoutOptionVisible();
        expect(isLogoutVisible).toBeFalsy();
        logger.info('Step 6: Authenticated options successfully removed');
    });

    logger.info('✅ Logout Flow completed successfully!');
});

