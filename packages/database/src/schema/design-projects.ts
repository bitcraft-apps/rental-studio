import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const projectStatus = pgEnum('project_status', [
  'draft',
  'in_progress',
  'completed',
  'archived',
]);

export const designProjects = pgTable('design_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .notNull()
    .references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatus('status').notNull().default('draft'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type DesignProject = typeof designProjects.$inferSelect;
export type NewDesignProject = typeof designProjects.$inferInsert;
