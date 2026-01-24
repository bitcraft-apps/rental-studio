import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema';

export type DatabaseConfig = {
  connectionString: string;
  pool?: Omit<PoolConfig, 'connectionString'>;
  /** Enable SSL for production connections. Defaults to true if NODE_ENV=production. */
  ssl?: boolean | { rejectUnauthorized: boolean };
  /** Optional error handler for pool errors. Defaults to console.error. */
  onPoolError?: (err: Error) => void;
};

/**
 * Default pool settings:
 * - max: 20 connections (suitable for single app instance; reduce if running multiple)
 * - idleTimeoutMillis: 30s before idle connections are closed
 * - connectionTimeoutMillis: 5s timeout for acquiring a connection
 */
const defaultPoolConfig: Omit<PoolConfig, 'connectionString'> = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export type DatabaseClient = {
  db: ReturnType<typeof drizzle<typeof schema>>;
  pool: Pool;
  /** Gracefully close all connections. Call this on SIGTERM/SIGINT. */
  close: () => Promise<void>;
};

export function createDb(config: DatabaseConfig): DatabaseClient {
  const isProduction = process.env.NODE_ENV === 'production';
  const ssl = config.ssl ?? (isProduction ? { rejectUnauthorized: true } : false);

  const pool = new Pool({
    connectionString: config.connectionString,
    ...defaultPoolConfig,
    ...config.pool,
    ssl,
  });

  // Handle unexpected pool errors to prevent unhandled rejections
  pool.on(
    'error',
    config.onPoolError ?? ((err) => console.error('Unexpected database pool error:', err)),
  );

  const db = drizzle(pool, { schema });

  return {
    db,
    pool,
    async close() {
      await pool.end();
    },
  };
}

export type Database = DatabaseClient['db'];

/**
 * Health check for database connection.
 * Use in readiness probes to verify database connectivity.
 */
export async function checkConnection(db: Database): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
