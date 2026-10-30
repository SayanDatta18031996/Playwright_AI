import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkLogout: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('a[title="My Account"]');
        this.lnkRegister = page.locator('.dropdown-menu a:has-text("Register")');
        this.lnkLogin = page.locator('.dropdown-menu a:has-text("Login")');
        this.lnkLogout = page.locator('.dropdown-menu a:has-text("Logout")');
        this.txtSearch = page.locator('input[name="search"]');
        this.btnSearch = page.locator('#search button');
    }

    /** Clicks My Account dropdown link */
    async clickMyAccount(): Promise<void> {
        await this.lnkMyAccount.click();
    }

    /** Navigates to the Register page via My Account dropdown */
    async clickRegister(): Promise<void> {
        await this.lnkMyAccount.click();
        await this.lnkRegister.waitFor({ state: 'visible' });
        await this.lnkRegister.click();
    }

    /** Navigates to the Login page via My Account dropdown */
    async clickLogin(): Promise<void> {
        await this.lnkMyAccount.click();
        await this.lnkLogin.waitFor({ state: 'visible' });
        await this.lnkLogin.click();
    }

    /** Clicks Logout via My Account dropdown */
    async clickLogout(): Promise<void> {
        await this.lnkMyAccount.click();
        await this.lnkLogout.waitFor({ state: 'visible' });
        await this.lnkLogout.click();
    }

    /**
     * Checks if the Logout option is visible in the My Account dropdown
     * @returns Promise<boolean> - true if Logout is visible
     */
    async isLogoutOptionVisible(): Promise<boolean> {
        try {
            await this.lnkMyAccount.click();
            const isLogoutVisible = await this.lnkLogout.isVisible();
            await this.lnkMyAccount.click();
            return isLogoutVisible;
        } catch (error) {
            console.log(`Error checking Logout option visibility: ${error}`);
            return false;
        }
    }

    /**
     * Checks if the Login option is visible in the My Account dropdown
     * @returns Promise<boolean> - true if Login is visible
     */
    async isLoginOptionVisible(): Promise<boolean> {
        try {
            await this.lnkMyAccount.click();
            const isLoginVisible = await this.lnkLogin.isVisible();
            await this.lnkMyAccount.click();
            return isLoginVisible;
        } catch (error) {
            console.log(`Error checking Login option visibility: ${error}`);
            return false;
        }
    }

    /**
     * Searches for a product using the search bar
     * @param productName - Product name to search for
     */
    async searchProduct(productName: string): Promise<void> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
    }

    /**
     * Checks if the Home page is displayed
     * @returns Promise<boolean> - true if the search bar is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.txtSearch.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Home page: ${error}`);
            return false;
        }
    }
}
