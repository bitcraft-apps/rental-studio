import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './schema';

export type DatabaseConfig = {
  connectionString: string;
  pool?: Omit<PoolConfig, 'connectionString'>;
  /**
   * SSL configuration for database connections.
   *
   * Defaults:
   * - Development (NODE_ENV !== 'production'): SSL disabled
   * - Production: { rejectUnauthorized: false } (accepts any valid cert)
   *
   * For stricter security with managed databases (RDS, Cloud SQL, etc.):
   * - Set DATABASE_CA_CERT env var with the CA certificate
   * - Or pass { rejectUnauthorized: true, ca: caCert } explicitly
   *
   * Note: Most managed databases require SSL but don't need strict CA verification
   * since the connection is already within a trusted network.
   */
  ssl?: boolean | { rejectUnauthorized: boolean; ca?: string };
  /** Optional error handler for pool errors. Defaults to console.error. */
  onPoolError?: (err: Error) => void;
};

/**
 * Default pool settings:
 * - max: 10 connections (conservative default; override via DB_POOL_MAX env var)
 * - idleTimeoutMillis: 30s before idle connections are closed
 * - connectionTimeoutMillis: 5s timeout for acquiring a connection
 *
 * For multiple app instances, ensure total connections don't exceed PostgreSQL's
 * max_connections (default 100). Formula: instances * max <= max_connections - reserved
 */
const defaultPoolConfig: Omit<PoolConfig, 'connectionString'> = {
  max: Number.parseInt(process.env.DB_POOL_MAX || '10', 10),
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

  // Determine SSL configuration
  let ssl: boolean | { rejectUnauthorized: boolean; ca?: string };
  if (config.ssl !== undefined) {
    ssl = config.ssl;
  } else if (isProduction) {
    // Warn about permissive SSL - users should configure explicit SSL for production
    console.warn(
      '[DATABASE] Using permissive SSL (rejectUnauthorized: false). ' +
        'For production, configure explicit SSL with CA certificate via DATABASE_CA_CERT ' +
        'or pass ssl config to createDb().',
    );
    ssl = { rejectUnauthorized: false };
  } else {
    ssl = false;
  }

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
