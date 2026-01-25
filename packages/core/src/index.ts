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

// Domain types are now defined in @rental-studio/database schema
// Import from there for type-safe database operations
