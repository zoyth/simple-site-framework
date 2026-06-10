#!/usr/bin/env node

// ABOUTME: Rewrites [-:=] to [-\x3a=] in dist output so Tailwind v4's scanner
// ABOUTME: never sees a token it would compile into invalid CSS (crashes Turbopack)

const fs = require('fs');
const path = require('path');

const TOKEN = '[-:=]';
// \x3a is ':' in both regex and string literals, so runtime behavior is identical
const REPLACEMENT = '[-\\x3a=]';

const distDir = path.join(__dirname, '..', 'dist');

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function escapeSourceMap(file) {
  // Source maps are JSON: replace inside the parsed strings so the
  // backslash gets re-escaped correctly on serialization
  const map = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  if (Array.isArray(map.sourcesContent)) {
    map.sourcesContent = map.sourcesContent.map((source) => {
      if (typeof source === 'string' && source.includes(TOKEN)) {
        changed = true;
        return source.split(TOKEN).join(REPLACEMENT);
      }
      return source;
    });
  }
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(map));
  }
  return changed;
}

function escapeText(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes(TOKEN)) {
    return false;
  }
  fs.writeFileSync(file, content.split(TOKEN).join(REPLACEMENT));
  return true;
}

let patched = 0;
for (const file of walk(distDir)) {
  const changed = file.endsWith('.map') ? escapeSourceMap(file) : escapeText(file);
  if (changed) {
    patched++;
    console.log(`escaped ${TOKEN} in ${path.relative(distDir, file)}`);
  }
}
console.log(`escape-tailwind-false-positives: ${patched} file(s) patched`);
