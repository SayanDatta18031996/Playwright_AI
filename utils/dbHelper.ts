/**
 * @file dbHelper.ts
 * @description Stateful MySQL database helper class for reusable connection management.
 *
 * Unlike dbClient.ts (which opens/closes a connection per query), DbHelper holds
 * a persistent connection that can be reused for multiple queries within a test.
 *
 * Typical usage pattern:
 *   1. Call connect() before running queries
 *   2. Call executeQuery() one or more times
 *   3. Call close() in the test teardown (afterEach / afterAll)
 *
 * Connection parameters are read from environment variables (never hardcoded).
 *
 * Environment variables used:
 *  - DB_HOST     : Database host     (default: "localhost")
 *  - DB_PORT     : Database port     (default: 3306)
 *  - DB_USER     : Database username (default: "root")
 *  - DB_PASSWORD : Database password (set via GitHub Secrets in CI)
 *  - DB_NAME     : Database schema   (default: "test_db")
 *
 * @example
 *   const db = new DbHelper();
 *   await db.connect();
 *   const rows = await db.executeQuery<User>('SELECT * FROM users WHERE id = ?', [1]);
 *   await db.close();
 */

import mysql from 'mysql2/promise';

/**
 * Stateful MySQL database helper.
 * Manages a single persistent connection across multiple queries.
 */
export class DbHelper {
  /** Active MySQL connection, null if not yet connected or already closed */
  private connection: mysql.Connection | null = null;

  /**
   * Opens a MySQL connection using credentials from environment variables.
   * Must be called before executeQuery().
   */
  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     Number(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'test_db',
    });
  }

  /**
   * Executes a SQL query on the open connection and returns typed results.
   * @param query  - SQL query string with optional `?` placeholders
   * @param params - Array of values to bind to `?` placeholders
   * @returns Promise resolving to an array of typed row objects
   * @throws Error if connect() was not called before this method
   *
   * @example
   *   const users = await db.executeQuery<User>('SELECT * FROM users');
   */
  async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.connection) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    const [rows] = await this.connection.execute(query, params);
    return rows as T[];
  }

  /**
   * Closes the active MySQL connection and resets the connection reference.
   * Safe to call even if the connection is already closed.
   */
  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}
