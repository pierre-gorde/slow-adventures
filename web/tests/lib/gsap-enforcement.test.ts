import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const srcDir = resolve(__dirname, '../../src');
const allowedFile = 'lib/gsap.ts';

function getSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getSourceFiles(fullPath));
    } else if (/\.(ts|astro|js)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('GSAP import enforcement', () => {
  it('only src/lib/gsap.ts imports directly from gsap package', () => {
    const violations: string[] = [];
    const sourceFiles = getSourceFiles(srcDir);

    for (const file of sourceFiles) {
      const relPath = relative(srcDir, file);
      if (relPath === allowedFile) continue;

      const content = readFileSync(file, 'utf-8');
      if (/from\s+['"]gsap['"]/.test(content)) {
        violations.push(relPath);
      }
      if (/from\s+['"]gsap\//.test(content)) {
        violations.push(relPath);
      }
    }

    expect(
      violations,
      `These files import directly from 'gsap' instead of '../lib/gsap': ${violations.join(', ')}`
    ).toEqual([]);
  });
});
