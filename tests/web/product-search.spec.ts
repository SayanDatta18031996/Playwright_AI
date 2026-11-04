/**
 * Test Case: Product Search Flow
 *
 * Description: Validate product search functionality and verify expected product appears in search results.
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Locate main product search field, enter valid product name, and submit
 * 3) Verify that search results page is displayed
 * 4) Verify that expected product appears in the results
 * 5) Verify that displayed product name matches search criteria
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { logger } from '../../utils/logger';

test('Product search flow test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
}) => {
    logger.info('=== Starting Product Search Flow Test ===');
    const { productName } = Helper.getProductDetails();
    logger.info(`Searching for target product: "${productName}"`);

    await test.step('1) Open the application', async () => {
        logger.info('Step 1: Checking Home page existence');
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
    });

    await test.step('2) Enter valid known product name and submit search', async () => {
        logger.info(`Step 2: Entering product name "${productName}" into search input and submitting`);
        await homePage.searchProduct(productName);
    });

    await test.step('3) Verify that search results page is displayed', async () => {
        logger.info('Step 3: Checking if Search Results page is displayed');
        const isSearchPageDisplayed = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchPageDisplayed).toBeTruthy();
        logger.info('Step 3: Search Results page confirmed visible');
    });

    await test.step('4) Verify that expected product appears in the results', async () => {
        logger.info(`Step 4: Checking visibility of product "${productName}" in results list`);
        const isProductInResults = await searchResultsPage.isProductVisible(productName);
        expect(isProductInResults).toBeTruthy();
        logger.info(`Step 4: Product "${productName}" is verified in search results`);
    });

    await test.step('5) Verify that count of results is greater than zero', async () => {
        logger.info('Step 5: Verifying product results count is greater than 0');
        const count = await searchResultsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
        logger.info(`Step 5: Total products returned in search results: ${count}`);
    });

    logger.info('✅ Product Search Flow completed successfully!');
});

