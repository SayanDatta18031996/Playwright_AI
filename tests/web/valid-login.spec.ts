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

test('Valid login flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
}) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open application and navigate to My Account -> Login', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
    });

    await test.step('2) Verify that the login page is displayed', async () => {
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
    });

    await test.step('3) Enter valid customer credentials and submit login form', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify successful authentication and redirection to My Account section', async () => {
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
    });

    await test.step('5) Verify that the account dashboard is visible', async () => {
        const heading = await myAccountPage.getPageHeading();
        expect(heading.trim()).toBe('My Account');
    });

    console.log('✅ Valid Login Flow completed successfully!');
});
