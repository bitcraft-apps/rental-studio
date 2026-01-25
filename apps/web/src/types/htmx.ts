/**
 * HTMX attribute types for type-safe JSX components.
 * Uses index signature to support all hx-* attributes without exhaustive enumeration.
 */
export type HtmxAttributes = {
  [K in `hx-${string}`]?: string;
};
