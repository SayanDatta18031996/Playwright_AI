/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Description: Validate customer login using external test data loaded from JSON,
 * generating one independent test per data row.
 *
 * Tags: @master @datadriven @web
 *
 * Steps:
 * 1) Open the login page
 * 2) Enter the email and password (leave blank if whitespace/empty)
 * 3) Submit the login form
 * 4) Validate expected outcome (success -> My Account displayed, failure -> Warning message displayed)
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import { logger } from '../../utils/logger';
import path from 'path';

interface LoginRecord {
    testName: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
}

const dataFilePath = path.resolve(__dirname, '../../testdata/Playwright_logindata.json');
const loginRecords = DataProvider.readJson(dataFilePath) as LoginRecord[];

test.describe.serial('Login Flow - Data Driven Tests', () => {
    for (const record of loginRecords) {
        test(`${record.testName} - [${record.expected}] @master @datadriven @web`, async ({
            homePage,
            loginPage,
            myAccountPage,
        }) => {
            logger.info(`=== Starting Data Driven Test: "${record.testName}" [expected: ${record.expected}] ===`);
            logger.info(`Test data: email="${record.email}", expectedOutcome="${record.expected}"`);

            await test.step('1) Open application and navigate to Login page', async () => {
                logger.info('Step 1: Clicking Login on Home page');
                await homePage.clickLogin();
                const isLoginDisplayed = await loginPage.isLoginPageExists();
                expect(isLoginDisplayed).toBeTruthy();
                logger.info('Step 1: Login page confirmed visible');
            });

            await test.step(`2) Submit login with email: "${record.email}"`, async () => {
                logger.info(`Step 2: Submitting login credentials for email: "${record.email}"`);
                await loginPage.login(record.email, record.password);
            });

            await test.step(`3) Validate outcome based on expected: ${record.expected}`, async () => {
                logger.info(`Step 3: Validating outcome against expected: "${record.expected}"`);
                if (record.expected === 'success') {
                    const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
                    expect(isMyAccountDisplayed).toBeTruthy();
                    const heading = await myAccountPage.getPageHeading();
                    expect(heading.trim()).toBe('My Account');
                    logger.info(`Step 3: Success confirmed with heading "${heading.trim()}"`);
                } else {
                    const warning = await loginPage.getWarningMessage();
                    const isWarningMatched =
                        warning.includes('Warning: No match for E-Mail Address and/or Password.') ||
                        warning.includes('Warning: Your account has exceeded allowed number of login attempts.');
                    expect(isWarningMatched).toBeTruthy();
                    const isMyAccountDisplayed = await myAccountPage.isMyAccountPageExists();
                    expect(isMyAccountDisplayed).toBeFalsy();
                    logger.info(`Step 3: Failure confirmed with warning: "${warning.trim()}"`);
                }
            });

            logger.info(`✅ Data driven test "${record.testName}" completed successfully!`);
        });
    }
});

