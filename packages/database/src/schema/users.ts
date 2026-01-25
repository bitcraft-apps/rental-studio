import { sql } from 'drizzle-orm';
import { check, index, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const userRole = pgEnum('user_role', ['owner', 'admin', 'member']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    name: text('name'),
    role: userRole('role').notNull().default('member'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    // Email unique per tenant, not globally
    tenantEmailUnique: unique('users_tenant_id_email_unique').on(table.tenantId, table.email),
    tenantIdx: index('users_tenant_id_idx').on(table.tenantId),
    // Basic email format validation - permissive to avoid rejecting valid edge cases
    // Strict validation should be done in the application layer with better error messages
    emailCheck: check('users_email_check', sql`${table.email} ~* '^[^@\\s]+@[^@\\s]+$'`),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
