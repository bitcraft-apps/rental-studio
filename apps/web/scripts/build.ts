/**
 * Build script for @rental-studio/web
 * Injects version information at build time to avoid runtime package.json resolution issues
 *
 * Note: APP_VERSION represents the application version (from web package.json), not individual
 * package versions. This is intentional - the app version is displayed to users and should
 * reflect the deployed application version, which is managed from the web package.
 */

import packageJson from '../package.json';

const version = packageJson.version;

console.log(`Building @rental-studio/web v${version}...`);

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'bun',
  define: {
    APP_VERSION_DEFINE: JSON.stringify(version),
  },
});

console.log('Build complete!');
