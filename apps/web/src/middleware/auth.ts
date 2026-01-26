import type { Context, Next } from 'hono';
import { isDevelopment } from '../lib/env';

// Log auth bypass warning once at startup if enabled
if (isDevelopment() && process.env.BYPASS_AUTH === 'true') {
  console.warn('[AUTH] Auth bypass enabled for development (BYPASS_AUTH=true)');
}

/**
 * Check if auth bypass is currently enabled.
 * Evaluated at runtime to support dynamic environment changes (e.g., in tests).
 */
function isAuthBypassEnabled(): boolean {
  return isDevelopment() && process.env.BYPASS_AUTH === 'true';
}

/**
 * Placeholder auth middleware - blocks access until real auth is implemented.
 *
 * Security behavior (fail-secure by default):
 * - Always redirects to login unless explicitly bypassed
 * - Set BYPASS_AUTH=true in development to test UI without auth
 *
 * TODO: Replace with actual session/JWT validation when auth is implemented.
 */
export const requireAuth = async (c: Context, next: Next) => {
  // When auth is implemented, check session/token here
  const isAuthenticated = false; // TODO: check session/token

  if (!isAuthenticated) {
    if (isAuthBypassEnabled()) {
      await next();
      return;
    }

    // Log for security auditing - helps detect probing attempts
    console.info(
      JSON.stringify({
        level: 'info',
        event: 'auth_redirect',
        method: c.req.method,
        path: c.req.path,
        reason: 'unauthenticated',
      }),
    );
    return c.redirect('/auth/login');
  }

  await next();
};
