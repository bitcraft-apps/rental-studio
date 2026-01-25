import { sql } from 'drizzle-orm';
import {
  check,
  index,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { floorPlans } from './floor-plans';

export const hotspotType = pgEnum('hotspot_type', ['info', 'link', 'media', 'product']);

/**
 * Content payload for each hotspot type.
 * The `type` column on the hotspots table determines which variant applies.
 *
 * IMPORTANT: There is no database-level enforcement that content matches the type.
 * Add Zod validation in the application layer when inserting/updating hotspots:
 *
 * @example
 * const InfoContent = z.object({ text: z.string() });
 * const LinkContent = z.object({ url: z.string().url(), title: z.string().optional() });
 * // ... then validate based on hotspot.type before insert/update
 */
export type HotspotContent =
  | { text: string } // type: 'info'
  | { url: string; title?: string } // type: 'link'
  | { mediaUrl: string; mediaType: 'image' | 'video' } // type: 'media'
  | { productId: string; name?: string; price?: number }; // type: 'product'

export const hotspots = pgTable(
  'hotspots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    floorPlanId: uuid('floor_plan_id')
      .notNull()
      .references(() => floorPlans.id, { onDelete: 'cascade' }),
    type: hotspotType('type').notNull().default('info'),
    label: text('label'),
    // Position as percentage of image dimensions (0.0 - 1.0)
    positionX: real('position_x').notNull(),
    positionY: real('position_y').notNull(),
    // Typed content based on hotspot type
    content: jsonb('content').$type<HotspotContent>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    floorPlanIdx: index('hotspots_floor_plan_id_idx').on(table.floorPlanId),
    positionXCheck: check(
      'hotspots_position_x_check',
      sql`${table.positionX} >= 0 AND ${table.positionX} <= 1`,
    ),
    positionYCheck: check(
      'hotspots_position_y_check',
      sql`${table.positionY} >= 0 AND ${table.positionY} <= 1`,
    ),
  }),
);

export type Hotspot = typeof hotspots.$inferSelect;
export type NewHotspot = typeof hotspots.$inferInsert;
