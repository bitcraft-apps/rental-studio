import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import app from './index';
import { setupErrorHandling } from './middleware/error-handler';

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
      expect(await res.text()).toContain('Welcome to Rental Studio');
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
      expect(await res.text()).toContain('Login');
    });

    it('POST /auth/logout should return logout', async () => {
      const res = await app.request('/auth/logout', { method: 'POST' });

      expect(res.status).toBe(200);
      expect(await res.text()).toContain('Logout');
    });
  });

  describe('App routes (/app/*)', () => {
    it('GET /app should return main application', async () => {
      const res = await app.request('/app');

      expect(res.status).toBe(200);
      expect(await res.text()).toContain('Main application');
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
      const res = await app.request('/nonexistent-route');
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.error).toBe('Not Found');
      expect(body.path).toBe('/nonexistent-route');
    });

    it('should return 404 JSON for unknown API routes', async () => {
      const res = await app.request('/api/unknown');
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.error).toBe('Not Found');
    });

    it('should handle thrown errors gracefully', async () => {
      const testApp = createTestApp();
      const res = await testApp.request('/test-error');
      const body = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(500);
      // Note: Actual error message is only exposed when NODE_ENV !== 'production'
      expect(body.error).toBe('Test error');
    });
  });
});
