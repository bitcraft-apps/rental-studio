/**
 * @rental-studio/core
 * Shared types, constants, and utilities for Rental Studio
 */

import packageJson from "../package.json";

// Constants
export const APP_NAME = "Rental Studio";
export const APP_VERSION = packageJson.version;

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
