import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/database/src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    // DATABASE_URL is only required for migrate/push/studio commands, not for generate
    url: databaseUrl ?? 'postgresql://localhost/placeholder',
  },
});
