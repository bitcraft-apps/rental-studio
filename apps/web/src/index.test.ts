import { describe, expect, it } from 'bun:test';
import app from './index';

interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
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
});
