/**
 * @file helper.ts
 * @description Static helper utility class providing shared test data and conversion methods.
 *
 * All test data is read from environment variables (set in .env locally, or via GitHub Secrets in CI).
 * This ensures credentials and product details are never hardcoded in source code.
 *
 * Environment variables used:
 *  - APP_EMAIL        : Login email for the web application
 *  - APP_PASSWORD     : Login password for the web application
 *  - PRODUCT_NAME     : Product name used in product-related tests (default: "MacBook")
 *  - PRODUCT_QUANTITY : Product quantity for cart tests (default: "1")
 *  - TOTAL_PRICE      : Expected total price for cart validation (default: "$602.00")
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Static helper class providing shared test data and utility methods.
 */
export class Helper {

  /**
   * Strips all non-numeric characters (except `.`) from a price string
   * and returns it as a number for numeric comparisons.
   *
   * @param price - Price string (e.g. "$602.00")
   * @returns number - Numeric price value (e.g. 602.00)
   *
   * @example
   *   Helper.convertPriceToNumber("$602.00") // → 602
   */
  static convertPriceToNumber(price: string): number {
    const cleaned = price.replace(/[^0-9.]/g, '');
    return Number(cleaned);
  }

  /**
   * Returns product test data from environment variables.
   * Falls back to default OpenCart MacBook values if env vars are not set.
   *
   * @returns Object containing productName, productQuantity, and totalPrice
   */
  static getProductDetails() {
    return {
      productName:     process.env.PRODUCT_NAME     || 'MacBook',
      productQuantity: process.env.PRODUCT_QUANTITY  || '1',
      totalPrice:      process.env.TOTAL_PRICE       || '$602.00',
    };
  }

  /**
   * Returns login credentials from environment variables.
   * Credentials must be configured in .env (locally) or via GitHub Secrets (CI).
   *
   * @returns Object containing email and password strings
   *
   * @throws Will not throw, but login tests will fail if APP_EMAIL / APP_PASSWORD are empty.
   */
  static getLoginDetails() {
    return {
      email:    process.env.APP_EMAIL    || '',
      password: process.env.APP_PASSWORD || '',
    };
  }
}
