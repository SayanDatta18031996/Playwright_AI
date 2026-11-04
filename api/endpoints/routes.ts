/**
 * @file routes.ts
 * @description API route constants for the FakeStore API (https://fakestoreapi.com).
 *
 * Centralizes all endpoint paths to avoid hardcoding URLs in test files.
 * Placeholder tokens (e.g. `{id}`, `{limit}`) must be replaced at runtime in tests.
 *
 * Usage:
 *   import { Routes } from '../api/endpoints/routes';
 *   const url = Routes.GET_PRODUCT_BY_ID.replace('{id}', '5');
 *   await request.get(`${Routes.BASE_URL}${url}`);
 *
 * @see https://fakestoreapi.com/docs
 */

export const Routes = {

    /** Base URL of the FakeStore API */
    BASE_URL: 'https://fakestoreapi.com',

    // ─── Product Routes ─────────────────────────────────────────────────────────

    /** GET all products */
    GET_ALL_PRODUCTS: '/products',

    /** GET a single product by ID — replace {id} with the product ID */
    GET_PRODUCT_BY_ID: '/products/{id}',

    /** GET products with a result limit — replace {limit} with the count */
    GET_PRODUCTS_WITH_LIMIT: '/products?limit={limit}',

    /** GET products sorted by order — replace {order} with "asc" or "desc" */
    GET_PRODUCTS_SORTED: '/products?sort={order}',

    /** GET all product categories */
    GET_ALL_CATEGORIES: '/products/categories',

    /** GET products filtered by category — replace {category} with the category name */
    GET_PRODUCTS_BY_CATEGORY: '/products/category/{category}',

    /** POST create a new product */
    CREATE_PRODUCT: '/products',

    /** PUT update a product — replace {id} with the product ID */
    UPDATE_PRODUCT: '/products/{id}',

    /** DELETE a product — replace {id} with the product ID */
    DELETE_PRODUCT: '/products/{id}',

    // ─── User Routes ─────────────────────────────────────────────────────────────

    /** GET all users */
    GET_ALL_USERS: '/users',

    /** GET a single user by ID — replace {id} with the user ID */
    GET_USER_BY_ID: '/users/{id}',

    /** GET users with a result limit — replace {limit} with the count */
    GET_USERS_WITH_LIMIT: '/users?limit={limit}',

    /** GET users sorted by order — replace {order} with "asc" or "desc" */
    GET_USERS_SORTED: '/users?sort={order}',

    /** POST create a new user */
    CREATE_USER: '/users',

    /** PUT update a user — replace {id} with the user ID */
    UPDATE_USER: '/users/{id}',

    /** DELETE a user — replace {id} with the user ID */
    DELETE_USER: '/users/{id}',

    // ─── Cart Routes ─────────────────────────────────────────────────────────────

    /** GET all carts */
    GET_ALL_CARTS: '/carts',

    /** GET a single cart by ID — replace {id} with the cart ID */
    GET_CART_BY_ID: '/carts/{id}',

    /** GET carts filtered by date range — replace {startdate} and {enddate} (YYYY-MM-DD) */
    GET_CARTS_BY_DATE_RANGE: '/carts?startdate={startdate}&enddate={enddate}',

    /** GET all carts for a specific user — replace {userId} with the user ID */
    GET_USER_CART: '/carts/user/{userId}',

    /** GET carts with a result limit — replace {limit} with the count */
    GET_CARTS_WITH_LIMIT: '/carts?limit={limit}',

    /** GET carts sorted by order — replace {order} with "asc" or "desc" */
    GET_CARTS_SORTED: '/carts?sort={order}',

    /** POST create a new cart */
    CREATE_CART: '/carts',

    /** PUT update a cart — replace {id} with the cart ID */
    UPDATE_CART: '/carts/{id}',

    /** DELETE a cart — replace {id} with the cart ID */
    DELETE_CART: '/carts/{id}',

    // ─── Authentication Routes ────────────────────────────────────────────────────

    /** POST login to get an auth token */
    AUTH_LOGIN: '/auth/login'
}
