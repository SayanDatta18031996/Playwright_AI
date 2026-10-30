import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
    }

    /**
     * Fills the First Name field
     * @param firstName - First name to enter
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Fills the Last Name field
     * @param lastName - Last name to enter
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Fills the Email field
     * @param email - Email to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills the Telephone field
     * @param telephone - Telephone number to enter
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Fills the Password field
     * @param password - Password to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Fills the Confirm Password field
     * @param password - Password to confirm
     */
    async setConfirmPassword(password: string): Promise<void> {
        await this.txtConfirmPassword.fill(password);
    }

    /** Accepts the Privacy Policy checkbox */
    async acceptPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /** Clicks the Continue button to submit registration */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Completes the full registration form and submits
     * @param firstName - First name
     * @param lastName - Last name
     * @param email - Email address
     * @param telephone - Telephone number
     * @param password - Password
     */
    async completeRegistration(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string,
        password: string
    ): Promise<void> {
        try {
            await this.txtFirstName.waitFor({ state: 'visible', timeout: 5000 });
            await this.setFirstName(firstName);
            await this.setLastName(lastName);
            await this.setEmail(email);
            await this.setTelephone(telephone);
            await this.setPassword(password);
            await this.setConfirmPassword(password);
            await this.acceptPrivacyPolicy();
            await this.clickContinue();
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Checks if the Register page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.txtFirstName.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking Register page: ${error}`);
            return false;
        }
    }
}
