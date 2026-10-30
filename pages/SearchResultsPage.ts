import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly lblSearchHeading: Locator;
    private readonly productItems: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblSearchHeading = page.locator('#content h1');
        this.productItems = page.locator('.product-layout');
    }

    /**
     * Checks if search results page is displayed
     * @returns Promise<boolean> - true if heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.lblSearchHeading.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Search Results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a product with the specified name is visible in search results
     * @param productName - Name of the product
     * @returns Promise<boolean> - true if product is visible
     */
    async isProductVisible(productName: string): Promise<boolean> {
        try {
            const productLink = this.page.locator(`.product-layout .caption a:has-text("${productName}")`).first();
            await productLink.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error verifying product visibility: ${error}`);
            return false;
        }
    }

    /**
     * Clicks on the specified product name from search results
     * @param productName - Name of the product to select
     */
    async selectProduct(productName: string): Promise<void> {
        try {
            const productLink = this.page.locator(`.product-layout .caption a:has-text("${productName}")`).first();
            await productLink.waitFor({ state: 'visible', timeout: 5000 });
            await productLink.click();
        } catch (error) {
            console.log(`Error selecting product "${productName}": ${error}`);
            throw error;
        }
    }

    /**
     * Gets the number of product results returned
     * @returns Promise<number> - Count of product items
     */
    async getProductCount(): Promise<number> {
        return await this.productItems.count();
    }
}

