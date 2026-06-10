// ABOUTME: Verifies the ./tailwind subpath ships Tailwind config helpers without the MDX chain
// ABOUTME: Guards against tailwind.config evaluation (jiti/Turbopack) pulling in ESM-only deps

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

describe('./tailwind subpath export', () => {
  it('is declared in the exports map with types, import, and require entries', () => {
    const entry = pkg.exports['./tailwind'];
    expect(entry, './tailwind missing from package.json exports').toBeDefined();
    expect(entry.types).toBeDefined();
    expect(entry.import).toBeDefined();
    expect(entry.require).toBeDefined();
  });

  it('loads under CJS with the Tailwind helpers, without the MDX dependency chain', () => {
    const requirePath = pkg.exports['./tailwind']?.require;
    expect(requirePath, './tailwind has no require entry').toBeDefined();
    expect(existsSync(path.join(root, requirePath)), `${requirePath} not built`).toBe(true);

    // Load in a child process the way jiti/node would evaluate tailwind.config,
    // then report which modules ended up in the require cache.
    const script = `
      const helpers = require(${JSON.stringify(path.join(root, requirePath))});
      const loaded = Object.keys(require.cache);
      console.log(JSON.stringify({
        exports: Object.keys(helpers).sort(),
        mdxChain: loaded.filter((p) =>
          /node_modules\\/(remark-gfm|rehype-slug|estree-walker|mdast|micromark)/.test(p)
        ),
      }));
    `;
    const result = JSON.parse(execFileSync(process.execPath, ['-e', script], { encoding: 'utf8' }));

    expect(result.exports).toContain('getTailwindColors');
    expect(result.exports).toContain('getTailwindContentConfig');
    expect(result.exports).toContain('stripTailwindFalsePositives');
    expect(result.mdxChain).toEqual([]);
  });
});
