import type { Context, Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Check if the request prefers HTML responses over JSON.
 * Handles quality values in Accept header for proper content negotiation.
 */
function acceptsHtml(c: Context): boolean {
  const accept = c.req.header('Accept') || '';

  // No accept header or wildcard - default to HTML for browser-like behavior
  if (!accept || accept === '*/*') {
    return true;
  }

  // If JSON is explicitly requested without HTML, prefer JSON
  if (accept.includes('application/json') && !accept.includes('text/html')) {
    return false;
  }

  // If HTML appears before JSON in the header, prefer HTML
  const htmlIndex = accept.indexOf('text/html');
  const jsonIndex = accept.indexOf('application/json');

  if (htmlIndex !== -1 && (jsonIndex === -1 || htmlIndex < jsonIndex)) {
    return true;
  }

  // Default to JSON for API-like requests
  return jsonIndex === -1;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render a simple error page with consistent styling
 */
function renderErrorPage(status: number, title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${status} - ${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  <main class="container" style="text-align: center; padding-top: 4rem;">
    <h1>${status}</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="/">← Back to Home</a></p>
  </main>
</body>
</html>`;
}

/**
 * Sets up global error handling for the Hono application.
 * - onError: Catches all uncaught errors and returns appropriate responses
 * - notFound: Returns 404 for unmatched routes
 *
 * Content-negotiates between HTML and JSON based on Accept header.
 */
export function setupErrorHandling(app: Hono) {
  app.onError((err, c) => {
    // TODO: Replace with structured logger (e.g., pino) that includes request context
    console.error(`[ERROR] ${err.message}`, err.stack);

    // HTTPException messages are assumed to be client-safe (e.g., "Unauthorized", "Bad Request")
    // Do not throw HTTPException with sensitive internal details
    if (err instanceof HTTPException) {
      if (acceptsHtml(c)) {
        return c.html(renderErrorPage(err.status, 'Error', err.message), err.status);
      }
      return c.json({ error: err.message }, err.status);
    }

    // In production, don't leak error details
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

    if (acceptsHtml(c)) {
      return c.html(renderErrorPage(500, 'Error', message), 500);
    }
    return c.json({ error: message }, 500);
  });

  app.notFound((c) => {
    if (acceptsHtml(c)) {
      return c.html(
        renderErrorPage(404, 'Not Found', 'The page you requested could not be found.'),
        404,
      );
    }

    const response: { error: string; path?: string } = { error: 'Not Found' };
    if (process.env.NODE_ENV !== 'production') {
      response.path = c.req.path;
    }
    return c.json(response, 404);
  });
}
