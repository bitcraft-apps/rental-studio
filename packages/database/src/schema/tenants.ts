import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Tenants table - represents organizations/landlords in the multi-tenant system.
 *
 * NOTE: `updated_at` is set to `now()` on INSERT only. Updates must explicitly
 * set `updatedAt: new Date()` in the query to keep this field current.
 */
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
