/**
 * Test Case: End-to-End Shopping Flow
 *
 * Description: Covers the complete customer shopping journey including registration,
 * re-authentication, product search, cart addition, and cart checkout validation.
 *
 * Tags: @master @sanity @regression @e2e @web
 *
 * Steps:
 * 1) Open the application and navigate to Register page
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out from the account
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product (MacBook)
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import { logger } from '../../utils/logger';

test('End-to-End Shopping Flow test @master @sanity @regression @end-to-end @e2e @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    logger.info('=== Starting End-to-End Shopping Flow Test ===');
    // Dynamic customer registration data
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `test_${Date.now()}_${RandomDataUtil.getEmail()}`;
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    // Known product test data from Helper
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
    logger.info(`Generated customer: ${firstName} ${lastName}, email="${email}"`);
    logger.info(`Target product: "${productName}", qty=${productQuantity}, expected total="${totalPrice}"`);

    await test.step('1) Open application and navigate to registration', async () => {
        logger.info('Step 1: Checking Home page and navigating to Register page');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickRegister();
        const isRegisterDisplayed = await registerPage.isRegisterPageExists();
        expect(isRegisterDisplayed).toBeTruthy();
        logger.info('Step 1: Register page confirmed visible');
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        logger.info(`Step 2: Submitting registration for: ${email}`);
        await registerPage.completeRegistration(
            firstName,
            lastName,
            email,
            telephone,
            password
        );
        logger.info('Step 2: Customer registration form submitted');
    });

    await test.step('3) Verify successful registration', async () => {
        logger.info('Step 3: Verifying Account Success page heading');
        const isSuccessDisplayed = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccessDisplayed).toBeTruthy();
        const heading = await accountSuccessPage.getPageHeading();
        expect(heading.trim()).toBe('Your Account Has Been Created!');
        logger.info(`Step 3: Registration confirmed: "${heading.trim()}"`);
    });

    await test.step('4) Log out', async () => {
        logger.info('Step 4: Logging out from newly created account');
        await homePage.clickLogout();
        const isLogoutDisplayed = await logoutPage.isLogoutPageExists();
        expect(isLogoutDisplayed).toBeTruthy();
        logger.info('Step 4: User logged out successfully');
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        logger.info(`Step 5: Re-authenticating with credentials: ${email}`);
        await homePage.clickLogin();
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
        await loginPage.login(email, password);
        logger.info('Step 5: Login submitted with newly created credentials');
    });

    await test.step('6) Verify successful authentication', async () => {
        logger.info('Step 6: Verifying user is logged in via My Account page');
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
        const heading = await myAccountPage.getPageHeading();
        expect(heading.trim()).toBe('My Account');
        logger.info(`Step 6: Authentication verified with heading "${heading.trim()}"`);
    });

    await test.step('7) Search for a known product', async () => {
        logger.info(`Step 7: Searching for product "${productName}"`);
        await homePage.searchProduct(productName);
        const isSearchPageDisplayed = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchPageDisplayed).toBeTruthy();
        const isProductInResults = await searchResultsPage.isProductVisible(productName);
        expect(isProductInResults).toBeTruthy();
        logger.info(`Step 7: Product "${productName}" visible in search results`);
    });

    await test.step('8) Open the product details page', async () => {
        logger.info(`Step 8: Selecting product "${productName}" from search results`);
        await searchResultsPage.selectProduct(productName);
        const isProductPageDisplayed = await productPage.isProductPageExists();
        expect(isProductPageDisplayed).toBeTruthy();
        const title = await productPage.getProductTitle();
        expect(title.trim()).toBe(productName);
        logger.info(`Step 8: Product page confirmed for "${title.trim()}"`);
    });

    await test.step('9) Add the product to the cart', async () => {
        logger.info(`Step 9: Adding product to cart with quantity ${productQuantity}`);
        await productPage.addProductToCart(productQuantity);
        const isAlertVisible = await productPage.isSuccessAlertVisible();
        expect(isAlertVisible).toBeTruthy();
        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain(`Success: You have added ${productName} to your shopping cart!`);
        logger.info(`Step 9: Product added to cart successfully: "${alertText.trim()}"`);
    });

    await test.step('10) Open the shopping cart', async () => {
        logger.info('Step 10: Opening shopping cart');
        await productPage.openShoppingCart();
        const isCartDisplayed = await shoppingCartPage.isShoppingCartPageExists();
        expect(isCartDisplayed).toBeTruthy();
        logger.info('Step 10: Shopping cart page displayed');
    });

    await test.step('11) Verify the correct product', async () => {
        logger.info('Step 11: Verifying product name in cart');
        const displayedProductName = await shoppingCartPage.getProductName();
        expect(displayedProductName.trim()).toContain(productName);
        logger.info(`Step 11: Product confirmed in cart: "${displayedProductName.trim()}"`);
    });

    await test.step('12) Verify the quantity', async () => {
        logger.info('Step 12: Verifying product quantity in cart');
        const displayedQuantity = await shoppingCartPage.getQuantity();
        expect(displayedQuantity.trim()).toBe(productQuantity);
        logger.info(`Step 12: Quantity verified as "${displayedQuantity.trim()}"`);
    });

    await test.step('13) Verify the product price', async () => {
        logger.info('Step 13: Verifying unit price');
        const unitPrice = await shoppingCartPage.getUnitPrice();
        expect(unitPrice.trim()).toBe(totalPrice);
        logger.info(`Step 13: Unit price verified as "${unitPrice.trim()}"`);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        logger.info('Step 14: Verifying overall cart total');
        const cartTotal = await shoppingCartPage.getCartTotal();
        expect(cartTotal.trim()).toBe(totalPrice);
        logger.info(`Step 14: Cart total verified as "${cartTotal.trim()}"`);
    });

    await test.step('15) Verify that the complete journey finishes without errors', async () => {
        logger.info('Step 15: Completing full customer journey verification');
        logger.info('✅ End-to-End Shopping Flow completed successfully with zero errors!');
    });
});

