import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const floorPlans = pgTable('floor_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .notNull()
    .references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type FloorPlan = typeof floorPlans.$inferSelect;
export type NewFloorPlan = typeof floorPlans.$inferInsert;
