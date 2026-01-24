import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export type PropertyMetadata = {
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  [key: string]: unknown;
};

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    address: text('address'),
    metadata: jsonb('metadata').$type<PropertyMetadata>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('properties_tenant_id_idx').on(table.tenantId),
  }),
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
