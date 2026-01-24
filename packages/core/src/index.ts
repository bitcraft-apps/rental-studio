/**
 * @rental-studio/core
 * Shared types, constants, and utilities for Rental Studio
 */

// APP_VERSION_DEFINE is injected at build time via Bun's --define flag
declare const APP_VERSION_DEFINE: string | undefined;

// Constants
export const APP_NAME = 'Rental Studio';

// APP_VERSION is injected at build time via --define flag for production builds.
// In development, it falls back to a default value.
export const APP_VERSION: string =
  typeof APP_VERSION_DEFINE !== 'undefined' ? APP_VERSION_DEFINE : '0.0.1-dev';

// Types (to be expanded)
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}
