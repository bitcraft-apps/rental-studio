import type { Context, Next } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { isDevelopment, isProduction } from '../lib/env';
import { renderErrorPage } from './error-handler';

/**
 * Validate that a string is a valid URL.
 * Returns the normalized origin if valid, null if invalid.
 */
function parseOrigin(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}

/**
 * Get allowed origins for CSRF validation.
 * Called per-request to support dynamic environment changes (e.g., container restarts).
 * In development, allows localhost on configured port. Otherwise, requires APP_URL env var.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // In development, derive origins from configured port
  if (isDevelopment()) {
    const port = process.env.PORT || '3000';
    origins.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
  }

  // Add production origin from environment (validated)
  const appUrl = process.env.APP_URL;
  if (appUrl) {
    const origin = parseOrigin(appUrl);
    if (origin) {
      origins.push(origin);
    } else if (isProduction()) {
      // Log warning in production if APP_URL is malformed
      console.error(`[CSRF] Invalid APP_URL: ${appUrl}`);
    }
  }

  return origins;
}

/**
 * Validate CSRF configuration at startup.
 * Fails fast in production if APP_URL is not properly configured.
 * Warns if NODE_ENV is not explicitly set to help catch deployment misconfigurations.
 */
function validateCsrfConfig(): void {
  // Warn if NODE_ENV is not set - helps catch deployment misconfigurations
  // where CSRF will fail because no origins are allowed
  if (!process.env.NODE_ENV) {
    console.warn(
      '[CSRF] NODE_ENV not set. Assuming production security posture. ' +
        'Set NODE_ENV=development for local development or NODE_ENV=production with APP_URL for production.',
    );
  }

  if (!isProduction()) return;

  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    throw new Error('APP_URL environment variable must be set for CSRF protection in production');
  }
  if (!parseOrigin(appUrl)) {
    throw new Error(`Invalid APP_URL: ${appUrl}`);
  }
}

// Validate at module load time - fail fast in production
validateCsrfConfig();

// Create CSRF middleware instance once at module load time
// Origin validation is dynamic to support environment changes
const csrfMiddleware = csrf({
  origin: (origin) => getAllowedOrigins().includes(origin),
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
