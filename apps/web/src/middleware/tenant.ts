import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

const isProduction = process.env.NODE_ENV === 'production';
const baseDomain = process.env.TENANT_BASE_DOMAIN?.toLowerCase();

if (isProduction && !baseDomain) {
  throw new Error('TENANT_BASE_DOMAIN must be configured in production');
}

export type TenantContext = {
  slug: string;
  host: string;
};

const TENANT_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function isValidTenantSlug(slug: string): boolean {
  return TENANT_SLUG_PATTERN.test(slug);
}

function isLocalHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function getForwardedHost(forwardedHeader: string | null): string | null {
  if (!forwardedHeader) return null;
  const firstEntry = forwardedHeader.split(',')[0]?.trim();
  if (!firstEntry) return null;
  const match = firstEntry.match(/host=([^;]+)/i);
  if (!match) return null;
  return match[1]?.replace(/^"|"$/g, '') ?? null;
}

function getRequestHost(c: Context): string | null {
  // Only enable TRUST_PROXY when a trusted proxy strips incoming forwarded headers.
  const trustProxy = process.env.TRUST_PROXY === 'true';
  const forwardedHost = trustProxy
    ? (c.req.header('x-forwarded-host') ?? getForwardedHost(c.req.header('forwarded')))
    : null;
  if (trustProxy && !forwardedHost) return null;
  const hostHeader = forwardedHost?.split(',')[0]?.trim() || c.req.header('host');
  if (!hostHeader) return null;
  const normalized = hostHeader.toLowerCase();
  if (!normalized) return null;

  if (normalized.startsWith('[')) {
    const endIndex = normalized.indexOf(']');
    if (endIndex === -1) return null;
    return normalized.slice(1, endIndex);
  }

  return normalized.split(':')[0] || null;
}

function resolveTenantSlug(host: string): string | null {
  if (baseDomain) {
    if (host === baseDomain) return null;
    if (!host.endsWith(`.${baseDomain}`)) return null;
    const slug = host.slice(0, -baseDomain.length - 1);
    return slug || null;
  }

  if (isLocalHost(host)) return null;

  if (host.endsWith('.localhost')) {
    const slug = host.slice(0, -'.localhost'.length);
    return slug || null;
  }

  return null;
}

function logTenantIssue(c: Context, reason: string, host?: string, slug?: string): void {
  const requestId = c.get('requestId') ?? 'unknown';
  console.info(
    JSON.stringify({
      level: 'info',
      event: 'tenant_resolution_failed',
      requestId,
      method: c.req.method,
      path: c.req.path,
      reason,
      host,
      slug,
    }),
  );
}

export function getTenant(c: Context): TenantContext | null {
  return c.get('tenant') ?? null;
}

export function requireTenant(c: Context): TenantContext {
  const tenant = getTenant(c);
  if (!tenant) {
    throw new HTTPException(404, { message: 'Not Found' });
  }
  return tenant;
}

export const withTenant = async (c: Context, next: Next) => {
  const host = getRequestHost(c);
  if (!host) {
    logTenantIssue(
      c,
      process.env.TRUST_PROXY === 'true' ? 'missing_forwarded_host' : 'missing_host',
    );
    throw new HTTPException(404, { message: 'Not Found' });
  }

  if (!baseDomain && !isLocalHost(host) && !host.endsWith('.localhost')) {
    logTenantIssue(c, 'base_domain_unset', host);
  }

  const slug = resolveTenantSlug(host);
  if (!slug) {
    logTenantIssue(c, 'missing_subdomain', host);
    throw new HTTPException(404, { message: 'Not Found' });
  }

  if (!isValidTenantSlug(slug)) {
    logTenantIssue(c, 'invalid_subdomain', host, slug);
    throw new HTTPException(404, { message: 'Not Found' });
  }

  c.set('tenant', { slug, host });
  await next();
};
