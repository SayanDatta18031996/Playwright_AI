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

test('Product search flow test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
}) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        const isHomeDisplayed = await homePage.isHomePageExists();
        expect(isHomeDisplayed).toBeTruthy();
    });

    await test.step('2) Enter valid known product name and submit search', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('3) Verify that search results page is displayed', async () => {
        const isSearchPageDisplayed = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchPageDisplayed).toBeTruthy();
    });

    await test.step('4) Verify that expected product appears in the results', async () => {
        const isProductInResults = await searchResultsPage.isProductVisible(productName);
        expect(isProductInResults).toBeTruthy();
    });

    await test.step('5) Verify that count of results is greater than zero', async () => {
        const count = await searchResultsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });

    console.log('✅ Product Search Flow completed successfully!');
});

