import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly lblProductTitle: Locator;
    private readonly lblPrice: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly lnkShoppingCartInAlert: Locator;
    private readonly lnkHeaderShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblProductTitle = page.locator('#content h1');
        this.lblPrice = page.locator('#content ul.list-unstyled:has-text("$") h2, #content .price, .price-new').first();
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
        this.lnkShoppingCartInAlert = page.locator('.alert-success a:has-text("shopping cart")');
        this.lnkHeaderShoppingCart = page.locator('a[title="Shopping Cart"]');
    }

    /**
     * Gets the displayed product title
     * @returns Promise<string> - Title text
     */
    async getProductTitle(): Promise<string> {
        await this.lblProductTitle.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblProductTitle.textContent()) || '';
    }

    /**
     * Gets the displayed product price
     * @returns Promise<string> - Price string (e.g., "$602.00")
     */
    async getProductPrice(): Promise<string> {
        await this.lblPrice.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblPrice.textContent()) || '';
    }

    /**
     * Sets the quantity of the product
     * @param quantity - Desired quantity
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Adds the product to cart with specified quantity
     * @param quantity - Quantity to set (default: "1")
     */
    async addProductToCart(quantity: string = '1'): Promise<void> {
        try {
            await this.txtQuantity.waitFor({ state: 'visible', timeout: 5000 });
            await this.setQuantity(quantity);
            await this.clickAddToCart();
            await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            console.log(`Error adding product to cart: ${error}`);
            throw error;
        }
    }

    /**
     * Checks if the success confirmation message is visible
     * @returns Promise<boolean> - true if success alert is visible
     */
    async isSuccessAlertVisible(): Promise<boolean> {
        try {
            await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking success alert: ${error}`);
            return false;
        }
    }

    /**
     * Gets the success alert text
     * @returns Promise<string> - Success alert message
     */
    async getSuccessAlertText(): Promise<string> {
        try {
            await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
            return (await this.alertSuccess.textContent()) || '';
        } catch (error) {
            console.log(`Error getting success alert text: ${error}`);
            return '';
        }
    }

    /**
     * Navigates to the shopping cart page via header link
     */
    async openShoppingCart(): Promise<void> {
        try {
            await this.lnkHeaderShoppingCart.waitFor({ state: 'visible', timeout: 5000 });
            await this.lnkHeaderShoppingCart.click();
        } catch (error) {
            console.log(`Error opening shopping cart: ${error}`);
            throw error;
        }
    }

    /**
     * Checks if the Product details page is displayed
     * @returns Promise<boolean> - true if add-to-cart button is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.btnAddToCart.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Product page: ${error}`);
            return false;
        }
    }
}

