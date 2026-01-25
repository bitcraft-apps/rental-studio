import type { Context, Next } from 'hono';

/**
 * Validate and sanitize a request ID.
 * Only accepts alphanumeric characters and dashes, max 64 chars (UUID format).
 * Returns null if invalid.
 */
function validateRequestId(id: string | undefined): string | null {
  if (!id) return null;
  // Only accept alphanumeric + dashes, max 64 chars to prevent log injection
  if (/^[a-zA-Z0-9-]{1,64}$/.test(id)) {
    return id;
  }
  return null;
}

/**
 * Request ID middleware for request tracing and log correlation.
 * Uses incoming x-request-id header if valid, otherwise generates a new UUID.
 * Sets the request ID in context and response header.
 */
export const requestId = async (c: Context, next: Next) => {
  const incoming = c.req.header('x-request-id');
  const id = validateRequestId(incoming) || crypto.randomUUID();

  c.set('requestId', id);
  c.header('X-Request-ID', id);

  await next();
};

/**
 * Get the request ID from context, or generate a new one if not set.
 * Use this in error handlers where middleware may not have run.
 */
export function getRequestId(c: Context): string {
  return c.get('requestId') || crypto.randomUUID();
}
