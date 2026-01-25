import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Creates a database client with connection pooling.
 *
 * Uses node-postgres (pg) defaults: max 10 connections, 30s idle timeout.
 * For production tuning, consider passing a custom Pool instance if needed.
 */
export function createDb(connectionString: string) {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  return {
    db,
    pool,
    async close() {
      await pool.end();
    },
  };
}

export type DatabaseClient = ReturnType<typeof createDb>;
export type Database = DatabaseClient['db'];

/**
 * Health check for readiness probes.
 * Returns true if the database is reachable, false otherwise.
 * Errors are logged to console for debugging but not thrown.
 */
export async function checkConnection(db: Database): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[database] Health check failed:', message);
    return false;
  }
}
