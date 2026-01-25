import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const projectStatus = pgEnum('project_status', [
  'draft',
  'in_progress',
  'completed',
  'archived',
]);

/**
 * Metadata for design projects.
 * Dates are stored as ISO 8601 strings (YYYY-MM-DD) for JSON compatibility.
 * Avoid putting structured data in customFields - add explicit fields instead.
 */
export type DesignProjectMetadata = {
  budget?: number;
  /** ISO 8601 date string (YYYY-MM-DD) */
  startDate?: string;
  /** ISO 8601 date string (YYYY-MM-DD) */
  endDate?: string;
  notes?: string;
  /** Tenant-specific custom data. Avoid for structured/queryable data. */
  customFields?: Record<string, unknown>;
};

export const designProjects = pgTable(
  'design_projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
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
    propertyIdx: index('design_projects_property_id_idx').on(table.propertyId),
  }),
);

export type DesignProject = typeof designProjects.$inferSelect;
export type NewDesignProject = typeof designProjects.$inferInsert;
