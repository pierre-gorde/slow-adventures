import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/PricingRow.astro'),
  'utf-8'
);

describe('PricingRow.astro', () => {
  describe('component is static (0 JS)', () => {
    it('does NOT contain a <script> tag', () => {
      expect(component).not.toMatch(/<script[\s>]/);
    });
  });

  describe('Props interface', () => {
    it('defines label prop', () => {
      expect(component).toContain('label');
    });

    it('defines price prop', () => {
      expect(component).toContain('price');
    });

    it('defines description as optional prop', () => {
      expect(component).toMatch(/description\?/);
    });
  });

  describe('semantic HTML', () => {
    it('uses <dt> for the label', () => {
      expect(component).toMatch(/<dt[\s>]/);
    });

    it('uses <dd> for the price', () => {
      expect(component).toMatch(/<dd[\s>]/);
    });
  });

  describe('typography', () => {
    it('uses font-semibold for label', () => {
      expect(component).toContain('font-semibold');
    });

    it('uses text-warm-black for label', () => {
      expect(component).toContain('text-warm-black');
    });

    it('uses font-serif for price', () => {
      expect(component).toContain('font-serif');
    });

    it('uses text-terracotta for price', () => {
      expect(component).toContain('text-terracotta');
    });

    it('uses text-2xl for price', () => {
      expect(component).toContain('text-2xl');
    });

    it('uses text-warm-gray for description', () => {
      expect(component).toContain('text-warm-gray');
    });

    it('uses text-sm for description', () => {
      expect(component).toContain('text-sm');
    });
  });

  describe('layout', () => {
    it('uses flex layout for row', () => {
      expect(component).toContain('flex');
    });

    it('uses dotted border separator via CSS pseudo-element', () => {
      expect(component).toContain('after:border-dotted');
    });

    it('uses border-b for row separation', () => {
      expect(component).toContain('border-b');
    });
  });

  describe('conditional description', () => {
    it('uses && guard for conditional rendering', () => {
      expect(component).toContain('description &&');
    });

    it('renders description in a <dd> element', () => {
      expect(component).toMatch(/<dd[\s\S]*?\{description\}/);
    });
  });

  describe('content rendering', () => {
    it('renders label text', () => {
      expect(component).toContain('{label}');
    });

    it('renders price text', () => {
      expect(component).toContain('{price}');
    });

    it('renders description text', () => {
      expect(component).toContain('{description}');
    });
  });
});
