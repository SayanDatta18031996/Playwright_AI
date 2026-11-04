import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly lblHeading: Locator;
    private readonly lnkProductName: Locator;
    private readonly txtQuantity: Locator;
    private readonly lblUnitPrice: Locator;
    private readonly lblItemTotal: Locator;
    private readonly lblCartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblHeading = page.locator('#content h1');
        this.lnkProductName = page.locator('.table-responsive table.table-bordered tbody td:nth-child(2) a');
        this.txtQuantity = page.locator('.table-responsive table.table-bordered tbody input[name*="quantity"]');
        this.lblUnitPrice = page.locator('.table-responsive table.table-bordered tbody td:nth-child(5)');
        this.lblItemTotal = page.locator('.table-responsive table.table-bordered tbody td:nth-child(6)');
        this.lblCartTotal = page.locator('#content table.table-bordered').last().locator('tr:last-child td:last-child');
    }

    /**
     * Checks if the shopping cart page is displayed
     * @returns Promise<boolean> - true if shopping cart table or heading is visible
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            await this.lnkProductName.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking Shopping Cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name displayed in the shopping cart
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        await this.lnkProductName.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lnkProductName.textContent()) || '';
    }

    /**
     * Gets the quantity value for the product in the cart
     * @returns Promise<string> - Quantity string
     */
    async getQuantity(): Promise<string> {
        await this.txtQuantity.waitFor({ state: 'visible', timeout: 5000 });
        return await this.txtQuantity.inputValue();
    }

    /**
     * Gets the unit price for the product in the cart
     * @returns Promise<string> - Unit price string
     */
    async getUnitPrice(): Promise<string> {
        await this.lblUnitPrice.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblUnitPrice.textContent()) || '';
    }

    /**
     * Gets the line item total price in the cart
     * @returns Promise<string> - Item total price string
     */
    async getItemTotal(): Promise<string> {
        await this.lblItemTotal.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblItemTotal.textContent()) || '';
    }

    /**
     * Gets the final overall cart total from the totals table
     * @returns Promise<string> - Cart total string (e.g. "$602.00")
     */
    async getCartTotal(): Promise<string> {
        await this.lblCartTotal.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblCartTotal.textContent()) || '';
    }
}

