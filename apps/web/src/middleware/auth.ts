import type { Context, Next } from 'hono';

/**
 * Placeholder auth middleware - blocks access until real auth is implemented.
 *
 * Security behavior:
 * - Production: Redirects to login (fail-secure)
 * - Development: Allows access with console warning (for testing UI)
 *
 * TODO: Replace with actual session/JWT validation when auth is implemented.
 */
export const requireAuth = async (c: Context, next: Next) => {
  // When auth is implemented, check session/token here
  // Fail secure: block access in production, allow in development for testing
  if (process.env.NODE_ENV === 'production') {
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

  // Only log once per request path to reduce noise
  if (!c.get('authWarningLogged')) {
    console.warn(
      `[AUTH] Unprotected access to ${c.req.path} - auth middleware not yet implemented`,
    );
    c.set('authWarningLogged', true);
  }

  await next();
};
