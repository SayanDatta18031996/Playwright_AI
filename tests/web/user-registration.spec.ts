/**
 * Test Case: User Registration Flow
 *
 * Description: Validate successful customer registration in the Playwright frontend store.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and navigate to My Account -> Register
 * 2) Verify that the registration page is displayed
 * 3) Generate a unique customer email and enter valid values
 * 4) Accept the Privacy Policy and submit the form
 * 5) Verify that registration succeeds and confirmation message is displayed
 * 6) Verify that the newly created account is available through expected account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { logger } from '../../utils/logger';

test('User registration flow test @master @sanity @regression @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
}) => {
    logger.info('=== Starting User Registration Flow Test ===');
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `test_reg_${Date.now()}_${RandomDataUtil.getEmail()}`;
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);
    logger.info(`Generated dynamic registration data: ${firstName} ${lastName}, email="${email}"`);

    await test.step('1) Open application and navigate to My Account -> Register', async () => {
        logger.info('Step 1: Checking Home page and navigating to Register page');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickRegister();
    });

    await test.step('2) Verify that the registration page is displayed', async () => {
        logger.info('Step 2: Verifying Register page visibility');
        const isRegisterDisplayed = await registerPage.isRegisterPageExists();
        expect(isRegisterDisplayed).toBeTruthy();
        logger.info('Step 2: Register page confirmed visible');
    });

    await test.step('3) Enter valid registration details and accept Privacy Policy', async () => {
        logger.info(`Step 3: Filling registration form for: ${email}`);
        await registerPage.setFirstName(firstName);
        await registerPage.setLastName(lastName);
        await registerPage.setEmail(email);
        await registerPage.setTelephone(telephone);
        await registerPage.setPassword(password);
        await registerPage.setConfirmPassword(password);
        await registerPage.acceptPrivacyPolicy();
        logger.info('Step 3: Registration fields populated and Privacy Policy accepted');
    });

    await test.step('4) Submit the registration form', async () => {
        logger.info('Step 4: Submitting registration form');
        await registerPage.clickContinue();
    });

    await test.step('5) Verify that registration succeeds with confirmation message', async () => {
        logger.info('Step 5: Verifying Account Success page and heading');
        const isSuccessDisplayed = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccessDisplayed).toBeTruthy();
        const heading = await accountSuccessPage.getPageHeading();
        expect(heading.trim()).toBe('Your Account Has Been Created!');
        logger.info(`Step 5: Success heading confirmed: "${heading.trim()}"`);
    });

    await test.step('6) Verify that the newly created account is available through account navigation', async () => {
        logger.info('Step 6: Navigating to My Account from success page');
        await accountSuccessPage.clickContinue();
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
        const myAccountHeading = await myAccountPage.getPageHeading();
        expect(myAccountHeading.trim()).toBe('My Account');
        logger.info(`Step 6: Confirmed newly created account is active with heading "${myAccountHeading.trim()}"`);
    });

    logger.info('✅ User Registration Flow completed successfully!');
});
