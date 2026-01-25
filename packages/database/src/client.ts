import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

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
    console.error('[database] Health check failed:', error);
    return false;
  }
}
