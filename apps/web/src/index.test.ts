import { describe, expect, it } from 'bun:test';
import app from './index';

interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
  path?: string;
  status?: number;
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

    it('GET /auth/logout should return logout', async () => {
      const res = await app.request('/auth/logout');

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

    it('should include CORS headers', async () => {
      const res = await app.request('/api/version', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://example.com',
          'Access-Control-Request-Method': 'GET',
        },
      });

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
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
  });
});
