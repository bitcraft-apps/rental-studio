/**
 * Environment detection utilities.
 * Centralized to ensure consistent behavior across the application.
 */

/**
 * Check if the application is running in production mode.
 * Returns true ONLY when NODE_ENV is explicitly set to 'production'.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if the application is running in a development environment.
 * Returns true for 'development' or 'test' NODE_ENV values.
 *
 * Note: Returns false if NODE_ENV is undefined, ensuring fail-secure behavior
 * for deployments that don't explicitly set NODE_ENV.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
}

/**
 * Check if the application is running in test mode.
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
