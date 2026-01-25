/**
 * Common HTMX attributes for better autocomplete and type safety.
 */
export type CommonHtmxAttributes = {
  'hx-get'?: string;
  'hx-post'?: string;
  'hx-put'?: string;
  'hx-patch'?: string;
  'hx-delete'?: string;
  'hx-trigger'?: string;
  'hx-target'?: string;
  'hx-swap'?: string;
  'hx-indicator'?: string;
  'hx-boost'?: string | boolean;
  'hx-push-url'?: string | boolean;
  'hx-confirm'?: string;
  'hx-vals'?: string;
  'hx-headers'?: string;
  'hx-select'?: string;
  'hx-select-oob'?: string;
  'hx-swap-oob'?: string | boolean;
  'hx-include'?: string;
  'hx-params'?: string;
  'hx-encoding'?: string;
  'hx-ext'?: string;
  'hx-disable'?: boolean;
  'hx-disabled-elt'?: string;
  'hx-sync'?: string;
  'hx-replace-url'?: string | boolean;
  'hx-on'?: string;
};

/**
 * HTMX attribute types for type-safe JSX components.
 * Combines common attributes with an index signature for less common ones.
 */
export type HtmxAttributes = CommonHtmxAttributes & {
  [K in `hx-${string}`]?: string | boolean;
};
