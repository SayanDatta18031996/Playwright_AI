import mysql from 'mysql2/promise';

export class DbHelper {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test_db',
    });
  }

  async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.connection) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    const [rows] = await this.connection.execute(query, params);
    return rows as T[];
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

