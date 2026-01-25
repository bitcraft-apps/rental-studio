import { describe, expect, it } from 'bun:test';
import { APP_NAME, APP_VERSION } from './index';

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
});
