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
import { logger } from '../../utils/logger';

test('Add product to cart test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    logger.info('=== Starting Add Product to Cart Flow Test ===');
    const { productName, productQuantity } = Helper.getProductDetails();
    logger.info(`Product to add: "${productName}", quantity=${productQuantity}`);

    await test.step('1) Open application and search for a valid known product', async () => {
        logger.info(`Step 1: Checking Home page and searching for "${productName}"`);
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
        await homePage.searchProduct(productName);
    });

    await test.step('2) Open product details page and verify details', async () => {
        logger.info(`Step 2: Selecting product "${productName}" from results`);
        await searchResultsPage.selectProduct(productName);
        const isProductPageDisplayed = await productPage.isProductPageExists();
        expect(isProductPageDisplayed).toBeTruthy();
        const title = await productPage.getProductTitle();
        expect(title.trim()).toBe(productName);
        logger.info(`Step 2: Product details page opened for: "${title.trim()}"`);
    });

    await test.step('3) Set required quantity and click Add to Cart', async () => {
        logger.info(`Step 3: Setting quantity to ${productQuantity} and clicking Add to Cart`);
        await productPage.addProductToCart(productQuantity);
    });

    await test.step('4) Verify the product-added success confirmation message', async () => {
        logger.info('Step 4: Checking success alert banner');
        const isAlertVisible = await productPage.isSuccessAlertVisible();
        expect(isAlertVisible).toBeTruthy();
        const alertText = await productPage.getSuccessAlertText();
        expect(alertText).toContain(`Success: You have added ${productName} to your shopping cart!`);
        logger.info(`Step 4: Success alert verified: "${alertText.trim()}"`);
    });

    await test.step('5) Open the shopping cart', async () => {
        logger.info('Step 5: Opening shopping cart page');
        await productPage.openShoppingCart();
        const isCartDisplayed = await shoppingCartPage.isShoppingCartPageExists();
        expect(isCartDisplayed).toBeTruthy();
        logger.info('Step 5: Shopping Cart page confirmed visible');
    });

    await test.step('6) Verify selected product is present in cart with requested quantity', async () => {
        logger.info('Step 6: Verifying product name and quantity in shopping cart table');
        const displayedProductName = await shoppingCartPage.getProductName();
        expect(displayedProductName.trim()).toContain(productName);
        const displayedQuantity = await shoppingCartPage.getQuantity();
        expect(displayedQuantity.trim()).toBe(productQuantity);
        logger.info(`Step 6: Cart validated with product="${displayedProductName.trim()}", quantity=${displayedQuantity.trim()}`);
    });

    logger.info('✅ Add Product to Cart Flow completed successfully!');
});

