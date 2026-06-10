// ABOUTME: Verifies shipped dist files contain no [-:=] tokens that Tailwind v4 scans as classes
// ABOUTME: Guards against Prism grammar regexes crashing Turbopack's CSS parser in consumer builds

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

const distDir = path.resolve(__dirname, '..', 'dist');

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

describe('dist Tailwind false positives', () => {
  it('ships no [-:=] token anywhere in dist', () => {
    const offenders = walk(distDir).filter((file) =>
      readFileSync(file, 'utf8').includes('[-:=]')
    );
    expect(
      offenders.map((f) => path.relative(distDir, f)),
      'Tailwind v4 parses [-:=] as an arbitrary property class and emits invalid CSS'
    ).toEqual([]);
  });
});
