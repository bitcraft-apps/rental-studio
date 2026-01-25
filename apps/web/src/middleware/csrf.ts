import type { Context, Next } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { renderErrorPage } from './error-handler';

/**
 * Validate that a string is a valid URL.
 * Throws if invalid, returns the normalized origin if valid.
 */
function validateUrl(url: string, name: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    throw new Error(`Invalid ${name}: ${url}`);
  }
}

/**
 * Check if we're in a known development environment.
 * Be explicit about what counts as development to fail-secure by default.
 */
function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
}

/**
 * Get allowed origins for CSRF validation.
 * In development, allows localhost on configured port. Otherwise, requires APP_URL env var.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // In development, derive origins from configured port
  if (isDevelopmentEnv()) {
    const port = process.env.PORT || '3000';
    origins.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
  }

  // Add production origin from environment (validated)
  if (process.env.APP_URL) {
    origins.push(validateUrl(process.env.APP_URL, 'APP_URL'));
  }

  return origins;
}

// Validate at module load time - fail fast if not in development and APP_URL is missing
const allowedOrigins = getAllowedOrigins();
if (!isDevelopmentEnv() && allowedOrigins.length === 0) {
  throw new Error('APP_URL environment variable must be set for CSRF protection');
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
