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
]);
