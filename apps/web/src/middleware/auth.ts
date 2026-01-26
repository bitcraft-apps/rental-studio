import type { Context, Next } from 'hono';
import { isDevelopment } from '../lib/env';

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
    // Require explicit opt-in to bypass auth (fail-secure by default)
    const bypassAuth = process.env.BYPASS_AUTH === 'true';

    if (isDevelopment() && bypassAuth) {
      // Log once per request (context is per-request, so this just prevents
      // duplicate logs if middleware runs multiple times in the same request)
      if (!c.get('authWarningLogged')) {
        console.warn(`[AUTH] Bypassing auth for ${c.req.path} (BYPASS_AUTH=true)`);
        c.set('authWarningLogged', true);
      }
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
