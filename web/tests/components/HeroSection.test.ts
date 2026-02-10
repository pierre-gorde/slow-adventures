import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/HeroSection.astro'),
  'utf-8'
);

describe('HeroSection.astro', () => {
  describe('Props interface', () => {
    it('defines posterSrc prop as ImageMetadata', () => {
      expect(component).toContain('posterSrc: ImageMetadata');
    });

    it('defines videoSrc prop as string', () => {
      expect(component).toContain('videoSrc: string');
    });

    it('defines title prop as string', () => {
      expect(component).toContain('title: string');
    });

    it('defines subtitle prop as string', () => {
      expect(component).toContain('subtitle: string');
    });
  });

  describe('HTML structure — semantic section (AC1)', () => {
    it('uses a <section> element for the hero', () => {
      expect(component).toContain('<section class="hero"');
    });

    it('has aria-label on the hero section', () => {
      expect(component).toContain('aria-label=');
    });

    it('contains an <h1> for the title', () => {
      expect(component).toContain('<h1');
      expect(component).toContain('hero__title');
    });

    it('contains a subtitle paragraph', () => {
      expect(component).toContain('<p');
      expect(component).toContain('hero__subtitle');
    });

    it('renders title with font-serif (Lora)', () => {
      expect(component).toContain('font-serif');
    });

    it('renders subtitle with font-sans (Plus Jakarta Sans)', () => {
      expect(component).toContain('hero__subtitle font-sans');
    });

    it('uses clamp() for responsive title sizing', () => {
      expect(component).toContain('clamp(2.5rem, 5vw, 4.5rem)');
    });
  });

  describe('Poster image (AC1)', () => {
    it('imports Image from astro:assets', () => {
      expect(component).toContain("import { Image } from 'astro:assets'");
    });

    it('uses <Image> component for the poster', () => {
      expect(component).toContain('<Image');
    });

    it('has responsive widths for srcset (768, 1440, 2880)', () => {
      expect(component).toContain('widths={[768, 1440, 2880]}');
    });

    it('has sizes="100vw" for full-width responsive', () => {
      expect(component).toContain('sizes="100vw"');
    });

    it('uses eager loading for LCP candidate', () => {
      expect(component).toContain('loading="eager"');
    });

    it('has hero__poster class', () => {
      expect(component).toContain('hero__poster');
    });

    it('uses object-fit: cover with center positioning', () => {
      expect(component).toContain('object-fit: cover');
      expect(component).toContain('object-position: center');
    });
  });

  describe('Video element (AC2)', () => {
    it('has a <video> element', () => {
      expect(component).toContain('<video');
    });

    it('has autoplay attribute', () => {
      expect(component).toMatch(/<video[\s\S]*?autoplay/);
    });

    it('has muted attribute', () => {
      expect(component).toMatch(/<video[\s\S]*?muted/);
    });

    it('has loop attribute', () => {
      expect(component).toMatch(/<video[\s\S]*?loop/);
    });

    it('has playsinline attribute', () => {
      expect(component).toMatch(/<video[\s\S]*?playsinline/);
    });

    it('has aria-hidden="true" (decorative)', () => {
      expect(component).toMatch(/<video[\s\S]*?aria-hidden="true"/);
    });

    it('stores video source in data-src', () => {
      expect(component).toContain('data-src={videoSrc}');
    });

    it('uses object-fit: cover with center for zoom-center effect', () => {
      expect(component).toContain('object-fit: cover');
      expect(component).toContain('object-position: center');
    });
  });

  describe('Dark overlay for contrast (AC1)', () => {
    it('has an overlay div', () => {
      expect(component).toContain('hero__overlay');
    });

    it('uses warm-black rgba for overlay at 0.8 opacity', () => {
      expect(component).toContain('rgba(44, 40, 37, 0.8)');
    });
  });

  describe('No CTA in hero (AC5)', () => {
    it('does NOT contain any button element', () => {
      expect(component).not.toMatch(/<button/i);
    });

    it('does NOT contain any anchor link', () => {
      expect(component).not.toMatch(/<a\s/i);
    });
  });

  describe('Responsive full-screen layout (AC7)', () => {
    it('uses 100vh for full viewport height', () => {
      expect(component).toContain('height: 100vh');
    });

    it('uses overflow: hidden to prevent horizontal scroll', () => {
      expect(component).toContain('overflow: hidden');
    });

    it('uses flexbox for centering content', () => {
      expect(component).toContain('display: flex');
      expect(component).toContain('align-items: center');
      expect(component).toContain('justify-content: center');
    });

    it('uses object-fit: cover on poster', () => {
      expect(component).toContain('object-fit: cover');
    });
  });

  describe('Video fade-in script (AC2)', () => {
    it('adds is-playing class when play() resolves', () => {
      expect(component).toContain("classList.add('is-playing')");
    });

    it('calls video.play() and shows video on promise resolution', () => {
      expect(component).toContain('.play()');
      expect(component).toContain('.then(');
    });

    it('has CSS transition for opacity on video', () => {
      expect(component).toContain('transition: opacity 1s ease-in-out');
    });

    it('creates source element dynamically with video/mp4 type', () => {
      expect(component).toContain("source.type = 'video/mp4'");
    });
  });

  describe('prefers-reduced-motion & Save-Data detection (AC3)', () => {
    it('detects prefers-reduced-motion: reduce', () => {
      expect(component).toContain('(prefers-reduced-motion: reduce)');
    });

    it('detects Save-Data via navigator.connection', () => {
      expect(component).toContain('connection?.saveData');
    });

    it('removes video when reduced-motion or Save-Data', () => {
      expect(component).toContain('video.remove()');
    });
  });

  describe('GSAP parallax — unified module (AC6)', () => {
    it('imports gsap from ../lib/gsap (NOT from gsap package)', () => {
      expect(component).toContain("from '../lib/gsap'");
    });

    it('does NOT import directly from gsap package', () => {
      expect(component).not.toMatch(/from\s+['"]gsap['"]/);
    });

    it('imports ScrollTrigger from unified module', () => {
      expect(component).toContain('ScrollTrigger');
    });

    it('uses gsap.matchMedia() for motion preference', () => {
      expect(component).toContain('gsap.matchMedia()');
    });

    it('targets prefers-reduced-motion: no-preference', () => {
      expect(component).toContain('(prefers-reduced-motion: no-preference)');
    });

    it('applies y: -50 parallax to title', () => {
      expect(component).toContain('y: -50');
    });

    it('uses scrub: 1 for smooth scroll-linked animation', () => {
      expect(component).toContain('scrub: 1');
    });

    it('has cleanup function that kills ScrollTriggers', () => {
      expect(component).toContain('ScrollTrigger.getAll()');
      expect(component).toContain('.kill()');
    });
  });

  describe('ScrollHint integration', () => {
    it('imports ScrollHint component', () => {
      expect(component).toContain(
        "import ScrollHint from './ScrollHint.astro'"
      );
    });

    it('renders ScrollHint inside the hero section', () => {
      expect(component).toContain('<ScrollHint />');
    });
  });
});
