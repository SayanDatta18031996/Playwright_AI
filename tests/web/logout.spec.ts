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

test('Logout flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
    logoutPage,
}) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open application and log in using valid customer credentials', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('2) Verify successful authentication', async () => {
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
    });

    await test.step('3) Navigate to account logout option and click Logout', async () => {
        await homePage.clickLogout();
    });

    await test.step('4) Verify logout confirmation page is displayed', async () => {
        const isLogoutDisplayed = await logoutPage.isLogoutPageExists();
        expect(isLogoutDisplayed).toBeTruthy();
        const heading = await logoutPage.getPageHeading();
        expect(heading.trim()).toBe('Account Logout');
    });

    await test.step('5) Click Continue and verify expected redirection', async () => {
        await logoutPage.clickContinue();
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
    });

    await test.step('6) Verify authenticated account options are no longer available', async () => {
        const isLoginVisible = await homePage.isLoginOptionVisible();
        expect(isLoginVisible).toBeTruthy();
        const isLogoutVisible = await homePage.isLogoutOptionVisible();
        expect(isLogoutVisible).toBeFalsy();
    });

    console.log('✅ Logout Flow completed successfully!');
});

