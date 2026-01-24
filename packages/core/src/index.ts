/**
 * @rental-studio/core
 * Shared types, constants, and utilities for Rental Studio
 */

// Constants
export const APP_NAME = "Rental Studio";
export const APP_VERSION = "0.0.1";

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
