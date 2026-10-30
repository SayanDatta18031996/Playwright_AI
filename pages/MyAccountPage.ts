import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly lblHeading: Locator;
    private readonly lnkEditAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblHeading = page.locator('#content h2').first();
        this.lnkEditAccount = page.locator('#content a:has-text("Edit your account information")');
    }

    /**
     * Gets the My Account page heading text
     * @returns Promise<string> - The heading text
     */
    async getPageHeading(): Promise<string> {
        return (await this.lblHeading.textContent()) || '';
    }

    /**
     * Checks if the My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.lblHeading.waitFor({ state: 'visible', timeout: 5000 });
            const heading = await this.lblHeading.textContent();
            return heading?.trim() === 'My Account';
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }
}

