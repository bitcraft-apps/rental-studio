import { index, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Users table - multi-tenant user accounts.
 *
 * NOTE: `updated_at` is set to `now()` on INSERT only. Updates must explicitly
 * set `updatedAt: new Date()` in the query to keep this field current.
 */
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index('users_tenant_id_idx').on(table.tenantId),
    emailPerTenant: unique('users_email_tenant_unique').on(table.tenantId, table.email),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
