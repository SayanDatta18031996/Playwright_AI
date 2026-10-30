import { Page, Locator } from '@playwright/test';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly lblPageHeading: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblPageHeading = page.locator('#content h1');
        this.lnkContinue = page.locator('#content a.btn-primary');
    }

    /**
     * Gets the heading text on the success page
     * @returns Promise<string> - The heading text
     */
    async getPageHeading(): Promise<string> {
        await this.lblPageHeading.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.lblPageHeading.textContent()) || '';
    }

    /** Clicks the Continue button after successful registration */
    async clickContinue(): Promise<void> {
        await this.lnkContinue.click();
    }

    /**
     * Checks if the Account Success page is displayed
     * @returns Promise<boolean> - true if the success heading is visible
     */
    async isAccountSuccessPageExists(): Promise<boolean> {
        try {
            await this.lblPageHeading.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Account Success page: ${error}`);
            return false;
        }
    }
}
