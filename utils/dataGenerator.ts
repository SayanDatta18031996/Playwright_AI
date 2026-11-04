/**
 * @file dataGenerator.ts
 * @description Random test data generator utility using the Faker.js library.
 *
 * Provides static methods to generate realistic random data for use in tests:
 *  - Person data  : names, emails, phone numbers, usernames, passwords
 *  - Location data: country, state, city, street, zip code, coordinates
 *  - Date & Time  : current, recent, future, past dates
 *  - Commerce data: product names, descriptions, prices, categories
 *  - API payloads : pre-built payload generators for FakeStore API
 *
 * All methods are static — no instantiation needed.
 *
 * @example
 *   import { RandomDataUtil } from '../utils/dataGenerator';
 *   const email = RandomDataUtil.getEmail();
 *   const payload = RandomDataUtil.generateProductPayload();
 */

import { faker } from '@faker-js/faker';

export class RandomDataUtil {
  // --- Person ---

  static getFirstName(): string {
    return faker.person.firstName().replace(/[^a-zA-Z]/g, '') || 'John';
  }

  static getLastName(): string {
    return faker.person.lastName().replace(/[^a-zA-Z]/g, '') || 'Doe';
  }

  static getFullName(): string {
    return `${this.getFirstName()} ${this.getLastName()}`;
  }

  static getEmail(): string {
    return faker.internet.email();
  }

  static getPhoneNumber(): string {
    return faker.string.numeric(10);
  }

  static getUsername(): string {
    return faker.internet.username();
  }

  static getPassword(length: number = 10): string {
    return faker.internet.password({ length });
  }

  static getCountry(): string {
    return faker.location.country();
  }

  static getState(): string {
    return faker.location.state();
  }

  static getCity(): string {
    return faker.location.city();
  }

  static getStreet(): string {
    return faker.location.street();
  }

  static getStreetAddress(): string {
    return faker.location.streetAddress();
  }

  static getZipCode(): string {
    return faker.location.zipCode();
  }

  static getLatitude(): string {
    return faker.location.latitude().toString();
  }

  static getLongitude(): string {
    return faker.location.longitude().toString();
  }

  // --- Date & Time ---

  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static getRecentDate(days: number = 10): string {
    return faker.date.recent({ days }).toISOString().split('T')[0];
  }

  static getFutureDate(years: number = 1): string {
    return faker.date.future({ years }).toISOString().split('T')[0];
  }

  static getPastDate(years: number = 1): string {
    return faker.date.past({ years }).toISOString().split('T')[0];
  }

  // --- Commerce ---

  static getProductName(): string {
    return faker.commerce.productName();
  }

  static getProductDescription(): string {
    return faker.commerce.productDescription();
  }

  static getProductPrice(): string {
    return faker.commerce.price({ min: 1, max: 500, dec: 2 });
  }

  static getDepartment(): string {
    return faker.commerce.department();
  }

  static getImageUrl(): string {
    return faker.image.url();
  }

  static getNumber(): number {
    return faker.number.int({ min: 1, max: 999 });
  }

  // --- API Payload Generators ---

  static generateInvalidLoginPayload() {
    return {
      username: RandomDataUtil.getUsername(),
      password: RandomDataUtil.getPassword(),
    };
  }

  static generateProductPayload() {
    return {
      title: RandomDataUtil.getProductName(),
      price: Number(RandomDataUtil.getProductPrice()),
      description: RandomDataUtil.getProductDescription(),
      image: RandomDataUtil.getImageUrl(),
      category: RandomDataUtil.getDepartment().toLowerCase(),
    };
  }

  static generateUpdatedProductPayload() {
    const product = RandomDataUtil.generateProductPayload();
    return {
      ...product,
      title: `Updated ${product.title}`,
    };
  }

  static generateUserPayload() {
    return {
      email: RandomDataUtil.getEmail(),
      username: RandomDataUtil.getUsername(),
      password: RandomDataUtil.getPassword(),
      name: {
        firstname: RandomDataUtil.getFirstName(),
        lastname: RandomDataUtil.getLastName(),
      },
      address: {
        city: RandomDataUtil.getCity(),
        street: RandomDataUtil.getStreet(),
        number: RandomDataUtil.getNumber(),
        zipcode: RandomDataUtil.getZipCode(),
        geolocation: {
          lat: RandomDataUtil.getLatitude(),
          long: RandomDataUtil.getLongitude(),
        },
      },
      phone: RandomDataUtil.getPhoneNumber(),
    };
  }

  static generateUserUpdatePayload() {
    const user = RandomDataUtil.generateUserPayload();
    return {
      ...user,
      username: `updated-${user.username}`,
    };
  }

  static generateCartPayload(userId: number) {
    return {
      userId,
      date: RandomDataUtil.getCurrentDate(),
      products: [
        {
          productId: RandomDataUtil.getNumber(),
          quantity: RandomDataUtil.getNumber(),
        },
      ],
    };
  }

  static generateUpdatedCartPayload(userId: number) {
    return {
      userId,
      date: RandomDataUtil.getCurrentDate(),
      products: [
        {
          productId: RandomDataUtil.getNumber(),
          quantity: RandomDataUtil.getNumber(),
        },
      ],
    };
  }
}

