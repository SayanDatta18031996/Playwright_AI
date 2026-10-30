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

test('Invalid login flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
}) => {
    const { username, password } = RandomDataUtil.generateInvalidLoginPayload();
    const invalidEmail = `${username}_${Date.now()}@invalidexample.com`;

    await test.step('1) Open application and navigate to My Account -> Login', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickLogin();
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
    });

    await test.step('2) Enter invalid credentials and submit login form', async () => {
        await loginPage.login(invalidEmail, password);
    });

    await test.step('3) Verify that authentication fails with expected warning message', async () => {
        const warning = await loginPage.getWarningMessage();
        expect(warning).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('4) Verify that the customer is not authenticated', async () => {
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeFalsy();
    });

    console.log('✅ Invalid Login Flow completed successfully!');
});

