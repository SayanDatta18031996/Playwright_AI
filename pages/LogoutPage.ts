import { Page, Locator } from '@playwright/test';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly lblHeading: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblHeading = page.locator('#content h1');
        this.lnkContinue = page.locator('#content a.btn-primary');
    }

    /**
     * Gets the logout page heading text
     * @returns Promise<string> - The heading text
     */
    async getPageHeading(): Promise<string> {
        return (await this.lblHeading.textContent()) || '';
    }

    /** Clicks the Continue button after logout */
    async clickContinue(): Promise<void> {
        await this.lnkContinue.click();
    }

    /**
     * Checks if the Logout page is displayed
     * @returns Promise<boolean> - true if the logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            const heading = await this.lblHeading.textContent();
            return heading?.trim() === 'Account Logout';
        } catch (error) {
            console.log(`Error checking Logout page: ${error}`);
            return false;
        }
    }
}

