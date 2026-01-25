import type { Context, Next } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { renderErrorPage } from './error-handler';

/**
 * Get allowed origins for CSRF validation.
 * In development, allows localhost. In production, requires APP_URL env var.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // Always allow localhost in development
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000');
  }

  // Add production origin from environment
  if (process.env.APP_URL) {
    origins.push(process.env.APP_URL);
  }

  return origins;
}

// Validate at module load time - fail fast in production if APP_URL is missing
const allowedOrigins = getAllowedOrigins();
if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  throw new Error('APP_URL environment variable must be set in production for CSRF protection');
}

// Create CSRF middleware instance once at module load time
const csrfMiddleware = csrf({
  origin: (origin) => allowedOrigins.includes(origin),
});

/**
 * CSRF middleware that wraps Hono's csrf() with a user-friendly error page.
 * The default CSRF middleware throws an HTTPException; this catches it and provides
 * a styled error page for a consistent user experience.
 *
 * Apply to routes that handle state-changing requests (POST, PUT, DELETE, PATCH).
 */
export const csrfProtection = async (c: Context, next: Next) => {
  try {
    return await csrfMiddleware(c, next);
  } catch (err) {
    // CSRF middleware throws HTTPException with status 403 on validation failure
    if (err instanceof HTTPException && err.status === 403) {
      return c.html(
        renderErrorPage(
          403,
          'Invalid Request',
          'Your session may have expired. Please refresh the page and try again.',
        ),
        403,
      );
    }
    // Re-throw other errors to be handled by global error handler
    throw err;
  }
};
