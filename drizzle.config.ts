import { defineConfig } from 'drizzle-kit';

// DATABASE_URL is required for migrate/push commands, but not for generate
// Generate only reads the schema files to produce SQL migrations
const databaseUrl = process.env.DATABASE_URL;

// Check if we're running a command that requires database connection
const commandRequiresDb = process.argv.some((arg) =>
  ['migrate', 'push', 'pull', 'studio', 'check'].includes(arg),
);

if (commandRequiresDb && !databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is required for this command.');
  console.error('Set it in your environment or .env file:');
  console.error('  DATABASE_URL=postgresql://user:password@localhost:5432/dbname');
  process.exit(1);
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/database/src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl ?? 'postgresql://localhost/placeholder',
  },
});
