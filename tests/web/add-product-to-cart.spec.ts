/**
 * Test Case: Add Product to Cart
 *
 * Description: Validate searching, opening product details, adding to cart, and confirming cart contents.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open application and search for a valid known product
 * 2) Open the product details page and verify product details are displayed
 * 3) Set the required quantity and click Add to Cart
 * 4) Verify the product-added success/confirmation message
 * 5) Open the shopping cart
 * 6) Verify selected product is present in cart with requested quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Open application and search for a valid known product', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.searchProduct(productName);
    });

    await test.step('2) Open product details page and verify details', async () => {
        await searchResultsPage.selectProduct(productName);
        const isProductPageDisplayed = await productPage.isProductPageExists();
        expect(isProductPageDisplayed).toBeTruthy();
        const title = await productPage.getProductTitle();
        expect(title.trim()).toBe(productName);
    });

    await test.step('3) Set required quantity and click Add to Cart', async () => {
        await productPage.addProductToCart(productQuantity);
    });

    await test.step('4) Verify the product-added success confirmation message', async () => {
        const isAlertVisible = await productPage.isSuccessAlertVisible();
        expect(isAlertVisible).toBeTruthy();
        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('5) Open the shopping cart', async () => {
        await productPage.openShoppingCart();
        const isCartDisplayed = await shoppingCartPage.isShoppingCartPageExists();
        expect(isCartDisplayed).toBeTruthy();
    });

    await test.step('6) Verify selected product is present in cart with requested quantity', async () => {
        const displayedProductName = await shoppingCartPage.getProductName();
        expect(displayedProductName.trim()).toContain(productName);
        const displayedQuantity = await shoppingCartPage.getQuantity();
        expect(displayedQuantity.trim()).toBe(productQuantity);
    });

    console.log('✅ Add Product to Cart Flow completed successfully!');
});

