import type { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Sets up global error handling for the Hono application.
 * - onError: Catches all uncaught errors and returns appropriate JSON responses
 * - notFound: Returns 404 for unmatched routes
 */
export function setupErrorHandling(app: Hono) {
  app.onError((err, c) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    }

    const status = 500;
    // In production, don't leak error details
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

    return c.json({ error: message }, status);
  });

  app.notFound((c) => {
    const response: { error: string; path?: string } = { error: 'Not Found' };
    if (process.env.NODE_ENV !== 'production') {
      response.path = c.req.path;
    }
    return c.json(response, 404);
  });
}
