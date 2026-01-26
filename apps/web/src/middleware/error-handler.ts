import type { Context, Hono } from 'hono';
import { accepts } from 'hono/accepts';
import { HTTPException } from 'hono/http-exception';
import { getRequestId } from './request-id';

/**
 * Log an error with structured context for debugging and monitoring.
 */
function logError(c: Context, err: Error, requestId: string): void {
  // TODO: Replace with structured logger (e.g., pino) for production
  const logEntry = {
    level: 'error',
    requestId,
    method: c.req.method,
    path: c.req.path,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  };
  console.error(JSON.stringify(logEntry));
}

/**
 * Check if the request prefers HTML responses over JSON.
 * Uses Hono's accepts helper for proper content negotiation with quality values.
 */
function acceptsHtml(c: Context): boolean {
  const accept = c.req.header('Accept') || '';

  // No accept header or wildcard - default to HTML for browser-like behavior
  if (!accept || accept === '*/*') {
    return true;
  }

  const accepted = accepts(c, {
    header: 'Accept',
    supports: ['text/html', 'application/json'],
    default: 'text/html',
  });

  return accepted === 'text/html';
}

/**
 * Escape HTML special characters to prevent XSS.
 * Uses single-pass replacement for efficiency.
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/**
 * Render a simple error page with consistent styling.
 * Exported for reuse in route handlers that need to return error pages.
 */
export function renderErrorPage(status: number, title: string, message: string): string {
  // Validate status is a safe integer to prevent injection
  if (!Number.isInteger(status) || status < 100 || status > 599) {
    throw new Error(`Invalid HTTP status code: ${status}`);
  }

  // Defense in depth: escape all dynamic values even though status is validated
  const safeStatus = String(status);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeStatus} - ${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/static/styles.css">
  <style>
    /* Critical inline styles in case CSS fails to load */
    .error-page { max-width: 40rem; margin: 4rem auto; text-align: center; padding: 0 1rem; font-family: system-ui, sans-serif; }
    .error-page h1 { font-size: 3rem; margin-bottom: 0.5rem; }
    .error-page p { margin-bottom: 1rem; color: #666; }
    .error-page a { color: #0066cc; }
  </style>
</head>
<body>
  <main class="app-container error-page" style="text-align: center; padding-top: 4rem;">
    <h1>${safeStatus}</h1>
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
    const requestId = getRequestId(c);
    logError(c, err, requestId);

    // Set request ID header for client-side error correlation
    c.header('X-Request-ID', requestId);

    // HTTPException messages are assumed to be client-safe (e.g., "Unauthorized", "Bad Request")
    // Do not throw HTTPException with sensitive internal details
    if (err instanceof HTTPException) {
      if (acceptsHtml(c)) {
        return c.html(renderErrorPage(err.status, 'Error', err.message), err.status);
      }
      return c.json({ error: err.message, requestId }, err.status);
    }

    // In production, don't leak error details
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

    if (acceptsHtml(c)) {
      return c.html(renderErrorPage(500, 'Error', message), 500);
    }
    return c.json({ error: message, requestId }, 500);
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
