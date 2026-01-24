import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema';

export type DatabaseConfig = {
  connectionString: string;
  pool?: Omit<PoolConfig, 'connectionString'>;
};

const defaultPoolConfig: Omit<PoolConfig, 'connectionString'> = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export function createDb(config: DatabaseConfig) {
  const pool = new Pool({
    connectionString: config.connectionString,
    ...defaultPoolConfig,
    ...config.pool,
  });

  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDb>;

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
