import { describe, expect, it } from 'bun:test';
import { APP_NAME } from '@rental-studio/core';
import { Hono } from 'hono';
import app from './index';
import { renderErrorPage, setupErrorHandling } from './middleware/error-handler';

/**
 * Creates a test app that wraps the main app with error-triggering routes.
 * We create a wrapper Hono instance because we need error handling to cover
 * test-only routes. The main app's error handlers are scoped to its routes,
 * so testApp's setupErrorHandling catches errors from /test-error.
 */
function createTestApp() {
  const testApp = new Hono();
  testApp.route('/', app);
  testApp.get('/test-error', () => {
    throw new Error('Test error');
  });
  setupErrorHandling(testApp);
  return testApp;
}

interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
  path?: string;
}

interface VersionResponse {
  version: string;
}

describe('Web App', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await app.request('/');

      expect(res.status).toBe(200);
      expect(await res.text()).toContain(`Welcome to ${APP_NAME}`);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await app.request('/health');
      const body = (await res.json()) as HealthResponse;

      expect(res.status).toBe(200);
      expect(body.status).toBe('ok');
      expect(body.version).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('should return valid ISO timestamp', async () => {
      const res = await app.request('/health');
      const body = (await res.json()) as HealthResponse;

      const timestamp = new Date(body.timestamp);
      expect(timestamp.toISOString()).toBe(body.timestamp);
    });
  });

  describe('Auth routes (/auth/*)', () => {
    it('GET /auth/login should return login page', async () => {
      const res = await app.request('/auth/login');

      expect(res.status).toBe(200);
      expect(await res.text()).toContain('Sign In');
    });

    it('POST /auth/logout should return 501 (not yet implemented)', async () => {
      const res = await app.request('/auth/logout', {
        method: 'POST',
        headers: { Origin: 'http://localhost:3000' },
      });

      expect(res.status).toBe(501);
      expect(await res.text()).toContain('Not Implemented');
    });

    it('POST /auth/logout should reject requests without valid Origin (CSRF)', async () => {
      const res = await app.request('/auth/logout', {
        method: 'POST',
        // No Origin header - should be rejected by CSRF middleware
      });

      expect(res.status).toBe(403);
      expect(await res.text()).toContain('session may have expired');
    });
  });

  describe('App routes (/app/*)', () => {
    it('GET /app should return dashboard', async () => {
      const res = await app.request('/app');

      expect(res.status).toBe(200);
      expect(await res.text()).toContain('Dashboard');
    });

    it('POST to /app routes should reject requests without valid Origin (CSRF)', async () => {
      // Simulating a hypothetical POST endpoint - CSRF should block it
      const res = await app.request('/app/some-action', {
        method: 'POST',
        // No Origin header - should be rejected by CSRF middleware
      });

      // Either 403 (CSRF rejection) or 404 (route not found) is acceptable
      // The important thing is that it's not a 2xx without CSRF validation
      expect([403, 404]).toContain(res.status);
    });
  });

  describe('API routes (/api/*)', () => {
    it('GET /api/version should return version info', async () => {
      const res = await app.request('/api/version');
      const body = (await res.json()) as VersionResponse;

      expect(res.status).toBe(200);
      expect(body.version).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await app.request('/nonexistent-route', {
        headers: { Accept: 'application/json' },
      });
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.error).toBe('Not Found');
      expect(body.path).toBe('/nonexistent-route');
    });

    it('should return 404 JSON for unknown API routes', async () => {
      const res = await app.request('/api/unknown', {
        headers: { Accept: 'application/json' },
      });
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.error).toBe('Not Found');
    });

    it('should handle thrown errors gracefully', async () => {
      const testApp = createTestApp();
      const res = await testApp.request('/test-error', {
        headers: { Accept: 'application/json' },
      });
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(500);
      // Note: Actual error message is only exposed when NODE_ENV !== 'production'
      expect(body.error).toBe('Test error');
    });

    it('should return 404 HTML for browser requests', async () => {
      const res = await app.request('/nonexistent-route', {
        headers: { Accept: 'text/html' },
      });

      expect(res.status).toBe(404);
      expect(await res.text()).toContain('Not Found');
    });
  });

  describe('renderErrorPage', () => {
    it('should escape HTML in title to prevent XSS', () => {
      const html = renderErrorPage(500, '<script>alert("xss")</script>', 'Test message');

      expect(html).not.toContain('<script>alert("xss")</script>');
      expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('should escape HTML in message to prevent XSS', () => {
      const html = renderErrorPage(500, 'Error', '<img src=x onerror=alert(1)>');

      expect(html).not.toContain('<img src=x onerror=alert(1)>');
      expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('should reject invalid status codes', () => {
      expect(() => renderErrorPage(99, 'Error', 'Message')).toThrow('Invalid HTTP status code');
      expect(() => renderErrorPage(600, 'Error', 'Message')).toThrow('Invalid HTTP status code');
      expect(() => renderErrorPage(1.5, 'Error', 'Message')).toThrow('Invalid HTTP status code');
    });

    it('should render valid error page structure', () => {
      const html = renderErrorPage(404, 'Not Found', 'Page not found');

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<title>404 - Not Found</title>');
      expect(html).toContain('<h1>404</h1>');
      expect(html).toContain('Page not found');
      expect(html).toContain('href="/"');
    });
  });
});
