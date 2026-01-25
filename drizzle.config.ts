import { defineConfig } from 'drizzle-kit';

// DATABASE_URL is only required for migrate/push commands, not for generate
// Generate only reads the schema files to produce SQL migrations
const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://localhost/placeholder';

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/database/src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
});
