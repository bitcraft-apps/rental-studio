import { pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { floorPlans } from './floor-plans';

export const hotspotType = pgEnum('hotspot_type', ['info', 'link', 'media', 'product']);

export const hotspots = pgTable('hotspots', {
  id: uuid('id').primaryKey().defaultRandom(),
  floorPlanId: uuid('floor_plan_id')
    .notNull()
    .references(() => floorPlans.id, { onDelete: 'cascade' }),
  type: hotspotType('type').notNull().default('info'),
  label: text('label'),
  // Position as percentage of image dimensions (0.0 - 1.0)
  positionX: real('position_x').notNull(),
  positionY: real('position_y').notNull(),
  // Flexible content storage (JSON or text depending on type)
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Hotspot = typeof hotspots.$inferSelect;
export type NewHotspot = typeof hotspots.$inferInsert;
