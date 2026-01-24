/**
 * Database Schema
 *
 * Design Decisions & Known Limitations:
 *
 * 1. MAGIC LINK CLEANUP: The magic_links table has no automatic cleanup.
 *    Implement a scheduled job to purge expired/used tokens periodically.
 *    Example: DELETE FROM magic_links WHERE expires_at < NOW() - INTERVAL '7 days'
 *
 * 2. TENANT SCOPING: design_projects, floor_plans, and hotspots don't have direct
 *    tenant_id columns - they inherit tenant scope through their parent relationships.
 *    Queries must join through the hierarchy to filter by tenant.
 *
 * 3. HOTSPOT CONTENT VALIDATION: The HotspotContent type provides TypeScript safety,
 *    but there's no database-level enforcement that content matches the hotspot type.
 *    Add application-level Zod validation when inserting/updating hotspots.
 *
 * 4. CASCADE DELETES: All child tables use ON DELETE CASCADE. Deleting a tenant
 *    permanently removes all their data. Consider soft-delete patterns if recovery
 *    or legal retention is needed.
 *
 * 5. USER LOGIN FLOW: Email is unique per tenant, not globally. The login flow
 *    should use tenant-scoped routing (e.g., subdomain or slug in URL) to identify
 *    which tenant context the user is authenticating against.
 */

export * from './design-projects';
export * from './floor-plans';
export * from './hotspots';
export * from './magic-links';
export * from './properties';
export * from './tenants';
export * from './users';
