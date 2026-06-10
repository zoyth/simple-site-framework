// ABOUTME: Verifies every module required by the published bin scripts is installable for npx users
// ABOUTME: Guards against CLI deps living in devDependencies or being bumped to ESM-only majors

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { builtinModules } from 'module';
import path from 'path';

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

function binRequires(): string[] {
  const binDir = path.join(root, 'bin');
  const modules = new Set<string>();
  for (const file of readdirSync(binDir)) {
    const source = readFileSync(path.join(binDir, file), 'utf8');
    for (const match of source.matchAll(/require\('([^']+)'\)/g)) {
      const name = match[1];
      if (name.startsWith('.')) continue;
      if (builtinModules.includes(name.replace(/^node:/, ''))) continue;
      modules.add(name);
    }
  }
  return [...modules].sort();
}

describe('bin script dependencies', () => {
  it('declares every bin require as a runtime dependency', () => {
    for (const name of binRequires()) {
      expect(
        pkg.dependencies?.[name],
        `${name} is required by a bin script but missing from dependencies`
      ).toBeDefined();
    }
  });

  it('only depends on CJS-loadable majors for bin requires', () => {
    for (const name of binRequires()) {
      const depPkg = JSON.parse(
        readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')
      );
      const cjsLoadable =
        depPkg.type !== 'module' ||
        (depPkg.exports && JSON.stringify(depPkg.exports).includes('require'));
      expect(
        cjsLoadable,
        `${name}@${depPkg.version} is ESM-only but bin scripts load it with require()`
      ).toBe(true);
    }
  });
});
