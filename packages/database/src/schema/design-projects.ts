import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { tenants } from './tenants';

export const projectStatus = pgEnum('project_status', [
  'draft',
  'in_progress',
  'completed',
  'archived',
]);

export type DesignProjectMetadata = {
  budget?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
};

export const designProjects = pgTable(
  'design_projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Denormalized for query performance - avoids JOIN through properties
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    status: projectStatus('status').notNull().default('draft'),
    metadata: jsonb('metadata').$type<DesignProjectMetadata>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('design_projects_tenant_id_idx').on(table.tenantId),
    propertyIdx: index('design_projects_property_id_idx').on(table.propertyId),
  }),
);

export type DesignProject = typeof designProjects.$inferSelect;
export type NewDesignProject = typeof designProjects.$inferInsert;
