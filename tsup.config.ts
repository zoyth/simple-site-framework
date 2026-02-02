import { defineConfig } from 'tsup';

export default defineConfig([
  // Main index and config - no 'use client' banner
  {
    entry: {
      index: 'src/index.ts',
      'config/index': 'src/config/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'next'],
  },
  // i18n lib - server-safe, no client code
  // Note: DTS disabled here, types come from main index
  {
    entry: {
      'lib/i18n/index': 'src/lib/i18n/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: false, // Disabled - use types from main index instead
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', 'next'],
  },
  // Components - needs 'use client' banner
  {
    entry: {
      'components/index': 'src/components/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean since first config already did
    external: ['react', 'react-dom', 'next'],
    banner: {
      js: "'use client';",
    },
  },
  // Client-only exports (browser APIs, React hooks)
  {
    entry: {
      client: 'src/client.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', 'next'],
    banner: {
      js: "'use client';",
    },
  },
]);
