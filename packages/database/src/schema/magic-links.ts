import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Magic Links for passwordless authentication.
 *
 * TOKEN GENERATION REQUIREMENTS:
 * - Generate tokens using crypto.randomBytes(32) (256 bits of entropy)
 * - Store SHA-256 hash of the token, never the plain token
 * - On unique constraint violation (extremely unlikely), regenerate and retry
 *
 * CLEANUP:
 * - Implement a scheduled job to purge expired/used tokens
 * - Example: DELETE FROM magic_links WHERE expires_at < NOW() - INTERVAL '7 days'
 *
 * NOTE: No updated_at column - magic links are immutable after creation.
 * They can only be marked as used (via used_at), never modified.
 */
export const magicLinks = pgTable(
  'magic_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Store SHA-256 hash of token, not the plain token
    // Application layer: hash(token) before storage and comparison
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    // Track IP for rate limiting and audit purposes
    ipAddress: text('ip_address'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('magic_links_user_id_idx').on(table.userId),
    expiresIdx: index('magic_links_expires_at_idx').on(table.expiresAt),
    // Support rate limiting queries by IP address
    ipCreatedIdx: index('magic_links_ip_created_idx').on(table.ipAddress, table.createdAt),
    // Support per-user rate limiting
    userCreatedIdx: index('magic_links_user_created_idx').on(table.userId, table.createdAt),
  }),
);

export type MagicLink = typeof magicLinks.$inferSelect;
export type NewMagicLink = typeof magicLinks.$inferInsert;
