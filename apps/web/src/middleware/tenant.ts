import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export type TenantContext = {
  slug: string;
  host: string;
};

const TENANT_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function isValidTenantSlug(slug: string): boolean {
  return TENANT_SLUG_PATTERN.test(slug);
}

function getRequestHost(c: Context): string | null {
  const forwardedHost = c.req.header('x-forwarded-host');
  const hostHeader = forwardedHost?.split(',')[0]?.trim() || c.req.header('host');
  if (!hostHeader) return null;
  return hostHeader.split(':')[0]?.toLowerCase() || null;
}

function resolveTenantSlug(host: string): string | null {
  const baseDomain = process.env.TENANT_BASE_DOMAIN?.toLowerCase();

  if (baseDomain) {
    if (host === baseDomain) return null;
    if (!host.endsWith(`.${baseDomain}`)) return null;
    const slug = host.slice(0, -baseDomain.length - 1);
    return slug || null;
  }

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return null;
  }

  if (host.endsWith('.localhost')) {
    const slug = host.slice(0, -'.localhost'.length);
    return slug || null;
  }

  const parts = host.split('.');
  if (parts.length < 3) return null;
  return parts[0] || null;
}

function logTenantIssue(c: Context, reason: string): void {
  console.info(
    JSON.stringify({
      level: 'info',
      event: 'tenant_resolution_failed',
      requestId: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      reason,
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
    logTenantIssue(c, 'missing_host');
    throw new HTTPException(404, { message: 'Not Found' });
  }

  const slug = resolveTenantSlug(host);
  if (!slug) {
    logTenantIssue(c, 'missing_subdomain');
    throw new HTTPException(404, { message: 'Not Found' });
  }

  if (!isValidTenantSlug(slug)) {
    logTenantIssue(c, 'invalid_subdomain');
    throw new HTTPException(404, { message: 'Not Found' });
  }

  c.set('tenant', { slug, host });
  await next();
};
