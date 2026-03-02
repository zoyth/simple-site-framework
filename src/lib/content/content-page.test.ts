// ABOUTME: Tests for generic content page loader and slug discovery
// ABOUTME: Verifies filesystem scanning and content loading options

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getContentSlugs } from './content-page';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true });
});

describe('getContentSlugs', () => {
  it('returns slugs from markdown files in a locale directory', () => {
    const enDir = path.join(tmpDir, 'en');
    fs.mkdirSync(enDir);
    fs.writeFileSync(path.join(enDir, 'about.md'), '# About');
    fs.writeFileSync(path.join(enDir, 'vision.md'), '# Vision');

    const slugs = getContentSlugs('en', tmpDir);
    expect(slugs.sort()).toEqual(['about', 'vision']);
  });

  it('handles .mdx extension', () => {
    const frDir = path.join(tmpDir, 'fr');
    fs.mkdirSync(frDir);
    fs.writeFileSync(path.join(frDir, 'cadre.mdx'), '# Cadre');

    const slugs = getContentSlugs('fr', tmpDir);
    expect(slugs).toEqual(['cadre']);
  });

  it('returns empty array when locale directory does not exist', () => {
    const slugs = getContentSlugs('es', tmpDir);
    expect(slugs).toEqual([]);
  });

  it('returns empty array when content directory does not exist', () => {
    const slugs = getContentSlugs('en', '/nonexistent/path');
    expect(slugs).toEqual([]);
  });

  it('ignores non-markdown files', () => {
    const enDir = path.join(tmpDir, 'en');
    fs.mkdirSync(enDir);
    fs.writeFileSync(path.join(enDir, 'about.md'), '# About');
    fs.writeFileSync(path.join(enDir, 'notes.txt'), 'notes');
    fs.writeFileSync(path.join(enDir, 'image.png'), 'binary');

    const slugs = getContentSlugs('en', tmpDir);
    expect(slugs).toEqual(['about']);
  });
});
