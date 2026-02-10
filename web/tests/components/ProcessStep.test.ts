import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/ProcessStep.astro'),
  'utf-8'
);

describe('ProcessStep.astro', () => {
  describe('component is static (0 JS)', () => {
    it('does NOT contain a <script> tag', () => {
      expect(component).not.toMatch(/<script[\s>]/);
    });
  });

  describe('Props interface', () => {
    it('defines number prop', () => {
      expect(component).toContain('number');
    });

    it('defines title prop', () => {
      expect(component).toContain('title');
    });

    it('defines description prop', () => {
      expect(component).toContain('description');
    });

    it('defines icon as optional string prop', () => {
      expect(component).toMatch(/icon\??:\s*string/);
    });
  });

  describe('semantic HTML', () => {
    it('renders as a <li> element', () => {
      expect(component).toMatch(/<li[\s>]/);
    });

    it('closes with </li>', () => {
      expect(component).toContain('</li>');
    });
  });

  describe('explicit numbering', () => {
    it('displays the number visually (not just CSS counter)', () => {
      expect(component).toContain('{number}');
    });

    it('styles number in terracotta', () => {
      expect(component).toContain('text-terracotta');
    });
  });

  describe('typography', () => {
    it('uses font-serif for title', () => {
      expect(component).toContain('font-serif');
    });

    it('uses font-sans for description', () => {
      expect(component).toContain('font-sans');
    });
  });

  describe('optional icon support', () => {
    it('conditionally renders SVG icon', () => {
      expect(component).toContain('icon');
      expect(component).toContain('set:html');
    });
  });
});
