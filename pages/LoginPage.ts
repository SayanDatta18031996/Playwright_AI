import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('input[value="Login"]');
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Fills the email address
     * @param email - User email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills the password
     * @param password - User password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Clicks the login button
     */
    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Performs complete login action
     * @param email - User email address
     * @param password - User password
     */
    async login(email?: string, password?: string): Promise<void> {
        try {
            await this.txtEmail.waitFor({ state: 'visible', timeout: 5000 });
            if (email && email.trim() !== '') {
                await this.setEmail(email.trim());
            } else {
                await this.txtEmail.clear();
            }
            if (password && password.trim() !== '') {
                await this.setPassword(password.trim());
            } else {
                await this.txtPassword.clear();
            }
            await this.clickLogin();
        } catch (error) {
            console.log(`Error during login: ${error}`);
            throw error;
        }
    }

    /**
     * Checks if the Login page is displayed
     * @returns Promise<boolean> - true if login form is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.btnLogin.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Login page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the text of warning/error alert
     * @returns Promise<string> - Warning message text
     */
    async getWarningMessage(): Promise<string> {
        try {
            await this.alertWarning.waitFor({ state: 'visible', timeout: 5000 });
            return (await this.alertWarning.textContent()) || '';
        } catch (error) {
            console.log(`Error getting warning message: ${error}`);
            return '';
        }
    }
}
