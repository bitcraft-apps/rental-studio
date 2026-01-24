/**
 * Build script for @rental-studio/web
 * Injects version information at build time to avoid runtime package.json resolution issues
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
