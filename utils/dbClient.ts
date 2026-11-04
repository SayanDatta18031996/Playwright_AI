/**
 * @file dbClient.ts
 * @description Lightweight MySQL database client for executing raw SQL queries.
 *
 * Creates a fresh MySQL connection per query call, executes the SQL, then closes.
 * Connection parameters are read from environment variables (never hardcoded).
 *
 * Environment variables required:
 *  - DB_HOST     : Database host (e.g. "localhost")
 *  - DB_PORT     : Database port (e.g. "3306")
 *  - DB_USER     : Database username
 *  - DB_PASSWORD : Database password (set via GitHub Secrets in CI)
 *  - DB_NAME     : Database name / schema
 *
 * Usage:
 *   import { executeQuery } from '../utils/dbClient';
 *   const rows = await executeQuery('SELECT * FROM users WHERE id = ?', [1]);
 */

import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Executes a SQL query against the configured MySQL database.
 * Opens a connection, runs the query, then closes the connection.
 *
 * @param sql    - SQL query string (supports parameterized `?` placeholders)
 * @param params - Optional array of parameter values to bind to `?` placeholders
 * @returns Promise resolving to the query result rows
 *
 * @example
 *   const results = await executeQuery('SELECT * FROM orders WHERE user_id = ?', [42]);
 */
export async function executeQuery(sql: string, params?: any[]) {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [result] = await connection.execute(sql, params);
  await connection.end();
  return result;
}
