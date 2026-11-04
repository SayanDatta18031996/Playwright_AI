/**
 * @file basePage.ts
 * @description Abstract base class for all Page Object Model (POM) pages.
 *
 * All page classes in the `pages/` directory should extend BasePage to inherit
 * common navigation and utility methods.
 *
 * BasePage provides:
 *  - navigateTo(path)  : Navigate to any URL/path
 *  - getTitle()        : Get the current page title
 *  - waitForElement()  : Wait for a locator to become visible
 */

import { Page, Locator } from '@playwright/test';

/**
 * Abstract base class inherited by all page objects.
 * Provides common browser interaction helpers used across all pages.
 */
export abstract class BasePage {
  /** The Playwright Page instance for this page object */
  readonly page: Page;

  /**
   * @param page - Playwright Page instance injected by the test fixture
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates the browser to the given URL or path.
   * @param path - Full URL or relative path to navigate to
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Returns the title of the current browser page.
   * @returns Promise<string> - The page title text
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Waits for the given locator to become visible on the page.
   * @param locator - The Playwright Locator to wait for
   */
  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }
}
