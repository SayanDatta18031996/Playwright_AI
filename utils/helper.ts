import dotenv from 'dotenv';
dotenv.config();

export class Helper {
  static convertPriceToNumber(price: string): number {
    const cleaned = price.replace(/[^0-9.]/g, '');
    return Number(cleaned);
  }

  static getProductDetails() {
    return {
      productName: process.env.PRODUCT_NAME || 'MacBook',
      productQuantity: process.env.PRODUCT_QUANTITY || '1',
      totalPrice: process.env.TOTAL_PRICE || '$602.00',
    };
  }

  static getLoginDetails() {
    return {
      email: process.env.APP_EMAIL || '',
      password: process.env.APP_PASSWORD || '',
    };
  }
}

