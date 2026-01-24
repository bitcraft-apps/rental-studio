import { describe, expect, it } from 'bun:test';
import { APP_NAME, APP_VERSION, type Tenant, type User } from './index';

describe('Core Package', () => {
  describe('Constants', () => {
    it('should export APP_NAME', () => {
      expect(APP_NAME).toBe('Rental Studio');
    });

    it('should export APP_VERSION', () => {
      expect(APP_VERSION).toBeDefined();
      expect(typeof APP_VERSION).toBe('string');
    });
  });

  describe('Types', () => {
    it('should allow creating User objects', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      expect(user.id).toBe('123');
      expect(user.email).toBe('test@example.com');
    });

    it('should allow User with null name', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        name: null,
        createdAt: new Date(),
      };

      expect(user.name).toBeNull();
    });

    it('should allow creating Tenant objects', () => {
      const tenant: Tenant = {
        id: '456',
        name: 'Acme Properties',
        slug: 'acme-properties',
        createdAt: new Date(),
      };

      expect(tenant.id).toBe('456');
      expect(tenant.slug).toBe('acme-properties');
    });
  });
});
