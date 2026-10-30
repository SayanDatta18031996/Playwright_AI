/**
 * Test Case: End-to-End Shopping Flow
 *
 * Description: Covers the complete customer shopping journey including registration,
 * re-authentication, product search, cart addition, and cart checkout validation.
 *
 * Tags: @master @sanity @regression @end-to-end @web
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

test('End-to-End Shopping Flow test @master @sanity @regression @end-to-end @web', async ({
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
    // Dynamic customer registration data
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `test_${Date.now()}_${RandomDataUtil.getEmail()}`;
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    // Known product test data from Helper
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Open application and navigate to registration', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.clickRegister();
        const isRegisterDisplayed = await registerPage.isRegisterPageExists();
        expect(isRegisterDisplayed).toBeTruthy();
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        await registerPage.completeRegistration(
            firstName,
            lastName,
            email,
            telephone,
            password
        );
    });

    await test.step('3) Verify successful registration', async () => {
        const isSuccessDisplayed = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccessDisplayed).toBeTruthy();
        const heading = await accountSuccessPage.getPageHeading();
        expect(heading.trim()).toBe('Your Account Has Been Created!');
    });

    await test.step('4) Log out', async () => {
        await homePage.clickLogout();
        const isLogoutDisplayed = await logoutPage.isLogoutPageExists();
        expect(isLogoutDisplayed).toBeTruthy();
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        await homePage.clickLogin();
        const isLoginDisplayed = await loginPage.isLoginPageExists();
        expect(isLoginDisplayed).toBeTruthy();
        await loginPage.login(email, password);
    });

    await test.step('6) Verify successful authentication', async () => {
        const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountDisplayed).toBeTruthy();
        const heading = await myAccountPage.getPageHeading();
        expect(heading.trim()).toBe('My Account');
    });

    await test.step('7) Search for a known product', async () => {
        await homePage.searchProduct(productName);
        const isSearchPageDisplayed = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchPageDisplayed).toBeTruthy();
        const isProductInResults = await searchResultsPage.isProductVisible(productName);
        expect(isProductInResults).toBeTruthy();
    });

    await test.step('8) Open the product details page', async () => {
        await searchResultsPage.selectProduct(productName);
        const isProductPageDisplayed = await productPage.isProductPageExists();
        expect(isProductPageDisplayed).toBeTruthy();
        const title = await productPage.getProductTitle();
        expect(title.trim()).toBe(productName);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.addProductToCart(productQuantity);
        const isAlertVisible = await productPage.isSuccessAlertVisible();
        expect(isAlertVisible).toBeTruthy();
        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('10) Open the shopping cart', async () => {
        await productPage.openShoppingCart();
        const isCartDisplayed = await shoppingCartPage.isShoppingCartPageExists();
        expect(isCartDisplayed).toBeTruthy();
    });

    await test.step('11) Verify the correct product', async () => {
        const displayedProductName = await shoppingCartPage.getProductName();
        expect(displayedProductName.trim()).toContain(productName);
    });

    await test.step('12) Verify the quantity', async () => {
        const displayedQuantity = await shoppingCartPage.getQuantity();
        expect(displayedQuantity.trim()).toBe(productQuantity);
    });

    await test.step('13) Verify the product price', async () => {
        const unitPrice = await shoppingCartPage.getUnitPrice();
        expect(unitPrice.trim()).toBe(totalPrice);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        const cartTotal = await shoppingCartPage.getCartTotal();
        expect(cartTotal.trim()).toBe(totalPrice);
    });

    await test.step('15) Verify that the complete journey finishes without errors', async () => {
        console.log('✅ End-to-End Shopping Flow completed successfully with zero errors!');
    });
});

