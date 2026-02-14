import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const page = readFileSync(
  resolve(__dirname, '../../src/pages/index.astro'),
  'utf-8'
);

describe('index.astro', () => {
  it('imports BaseLayout', () => {
    expect(page).toContain('BaseLayout');
  });

  it('uses BaseLayout with title prop', () => {
    expect(page).toContain('Slow Adventures');
  });

  it('uses BaseLayout with description prop', () => {
    expect(page).toContain('Création de voyages sur mesure');
  });

  it('contains a main element with id', () => {
    expect(page).toContain('<main id="main"');
  });

  it('does NOT import global.css directly', () => {
    expect(page).not.toContain("import '../styles/global.css'");
    expect(page).not.toContain('import "../styles/global.css"');
  });

  describe('HeroSection integration', () => {
    it('imports HeroSection component', () => {
      expect(page).toContain(
        "import HeroSection from '../components/HeroSection.astro'"
      );
    });

    it('renders HeroSection inside a <header> element', () => {
      expect(page).toContain('<header>');
      expect(page).toContain('<HeroSection');
      const headerIdx = page.indexOf('<header>');
      const heroIdx = page.indexOf('<HeroSection');
      const headerCloseIdx = page.indexOf('</header>');
      expect(heroIdx).toBeGreaterThan(headerIdx);
      expect(heroIdx).toBeLessThan(headerCloseIdx);
    });

    it('passes poster image as posterSrc', () => {
      expect(page).toContain('posterSrc={heroPoster}');
    });

    it('passes video path', () => {
      expect(page).toContain('videoSrc="/videos/hero.mp4"');
    });

    it('passes title "Slow Adventures"', () => {
      expect(page).toContain('title="Slow Adventures"');
    });

    it('passes subtitle', () => {
      expect(page).toContain(
        'subtitle="Voyages sur mesure exclusivement aux Amériques"'
      );
    });

    it('imports hero poster from assets', () => {
      expect(page).toContain("from '../assets/images/hero-poster.webp'");
    });

    it('uses getImage for poster preload optimization', () => {
      expect(page).toContain("import { Image, getImage } from 'astro:assets'");
      expect(page).toContain('getImage(');
    });

    it('passes heroPreloadImage to BaseLayout', () => {
      expect(page).toContain('heroPreloadImage={optimizedPoster.src}');
    });

    it('has h1 only inside HeroSection (unique on page)', () => {
      expect(page).not.toMatch(/<h1/);
    });
  });

  describe('ElenaSection integration', () => {
    it('imports ElenaSection component', () => {
      expect(page).toContain(
        "import ElenaSection from '../components/ElenaSection.astro'"
      );
    });

    it('renders ElenaSection after HeroSection', () => {
      expect(page).toContain('<ElenaSection');
    });

    it('imports elena photo from assets', () => {
      expect(page).toContain("from '../assets/images/elena.webp'");
    });

    it('passes imageSrc prop', () => {
      expect(page).toContain('imageSrc={elenaPhoto}');
    });

    it('passes imageAlt prop with descriptive text', () => {
      expect(page).toContain('imageAlt=');
    });

    it('passes title and description props', () => {
      expect(page).toContain('title="Hola, Hello, Olà"');
    });

    it('passes ctaHref with PUBLIC_CALENDLY_URL', () => {
      expect(page).toContain('ctaHref={import.meta.env.PUBLIC_CALENDLY_URL}');
      expect(page).not.toContain('ctaHref="#contact"');
    });
  });

  describe('Destinations section integration', () => {
    it('imports getCollection from astro:content', () => {
      expect(page).toContain("import { getCollection } from 'astro:content'");
    });

    it('imports DestinationBlock component', () => {
      expect(page).toContain(
        "import DestinationBlock from '../components/DestinationBlock.astro'"
      );
    });

    it('fetches destinations collection', () => {
      expect(page).toContain("getCollection('destinations')");
    });

    it('sorts destinations by order using immutable spread', () => {
      expect(page).toContain('[...destinations].sort(');
      expect(page).toContain('a.data.order - b.data.order');
    });

    it('maps sorted destinations to DestinationBlock components', () => {
      expect(page).toContain('sortedDestinations.map(');
    });

    it('wraps each DestinationBlock in SectionReveal', () => {
      expect(page).toContain('<SectionReveal animation="fade-in">');
      expect(page).toContain('<DestinationBlock');
    });

    it('passes image data from content collection', () => {
      expect(page).toContain('dest.data.image');
    });

    it('passes country and description from content', () => {
      expect(page).toContain('dest.data.country');
      expect(page).toContain('dest.data.description');
    });

    it('passes overlayColor from content', () => {
      expect(page).toContain('dest.data.overlayColor');
    });

    it('generates descriptive imageAlt from country name', () => {
      expect(page).toContain('Paysage de ${dest.data.country}');
    });
  });

  describe('section IDs for accessibility and anchoring', () => {
    it('passes id="elena" prop to ElenaSection', () => {
      expect(page).toContain('id="elena"');
    });

    it('has id="destinations" section wrapping DestinationBlocks', () => {
      expect(page).toContain('id="destinations"');
    });

    it('has sr-only heading "Nos destinations" for screen readers', () => {
      expect(page).toContain('class="sr-only">Nos destinations</h2>');
    });

    it('has id="processus" on the process section', () => {
      expect(page).toContain('id="processus"');
    });

    it('has id="temoignages" on the testimonials section', () => {
      expect(page).toContain('id="temoignages"');
    });

    it('has id="tarifs" on the pricing section', () => {
      expect(page).toContain('id="tarifs"');
    });

    it('has id="cta-final" on the CTA finale section', () => {
      expect(page).toContain('id="cta-final"');
    });
  });

  describe('aria-labelledby on all sections', () => {
    it('destinations section has aria-labelledby="heading-destinations"', () => {
      expect(page).toContain('aria-labelledby="heading-destinations"');
      expect(page).toContain('id="heading-destinations"');
    });

    it('processus section has aria-labelledby="heading-processus"', () => {
      expect(page).toContain('aria-labelledby="heading-processus"');
      expect(page).toContain('id="heading-processus"');
    });

    it('temoignages section has aria-labelledby="heading-temoignages"', () => {
      expect(page).toContain('aria-labelledby="heading-temoignages"');
      expect(page).toContain('id="heading-temoignages"');
    });

    it('tarifs section has aria-labelledby="heading-tarifs"', () => {
      expect(page).toContain('aria-labelledby="heading-tarifs"');
      expect(page).toContain('id="heading-tarifs"');
    });

    it('cta-final section has aria-labelledby="heading-cta-final"', () => {
      expect(page).toContain('aria-labelledby="heading-cta-final"');
      expect(page).toContain('id="heading-cta-final"');
    });
  });

  describe('section rendering order', () => {
    it('renders sections in order: Hero → Elena → Destinations → Processus → Témoignages → Pricing → CTA finale → Email Capture', () => {
      const heroIdx = page.indexOf('<HeroSection');
      const elenaIdx = page.indexOf('<ElenaSection');
      const destIdx = page.indexOf('sortedDestinations.map(');
      const processIdx = page.indexOf('Du rêve à la réalité');
      const testimonialsIdx = page.indexOf('Ils ont vécu SlowAdventures');
      const pricingIdx = page.indexOf('Ici, on est transparent');
      const ctaFinalIdx = page.indexOf('id="cta-final"');
      const emailCaptureIdx = page.indexOf('<EmailCapture');
      expect(heroIdx).toBeGreaterThan(-1);
      expect(elenaIdx).toBeGreaterThan(heroIdx);
      expect(destIdx).toBeGreaterThan(elenaIdx);
      expect(processIdx).toBeGreaterThan(destIdx);
      expect(testimonialsIdx).toBeGreaterThan(processIdx);
      expect(pricingIdx).toBeGreaterThan(testimonialsIdx);
      expect(ctaFinalIdx).toBeGreaterThan(pricingIdx);
      expect(emailCaptureIdx).toBeGreaterThan(ctaFinalIdx);
    });
  });

  describe('Processus section integration', () => {
    it('imports SectionReveal component', () => {
      expect(page).toContain(
        "import SectionReveal from '../components/SectionReveal.astro'"
      );
    });

    it('imports ProcessStep component', () => {
      expect(page).toContain(
        "import ProcessStep from '../components/ProcessStep.astro'"
      );
    });

    it('imports processSteps data', () => {
      expect(page).toContain("from '../data/processSteps'");
    });

    it('has a section with bg-creme background', () => {
      expect(page).toContain('bg-creme');
    });

    it('uses sa-section-padding', () => {
      expect(page).toContain('sa-section-padding');
    });

    it('has h2 title "Du rêve à la réalité"', () => {
      expect(page).toContain('Du rêve à la réalité');
    });

    it('uses SectionReveal with stagger animation', () => {
      expect(page).toContain('animation="stagger"');
    });

    it('uses an ordered list for process steps', () => {
      expect(page).toMatch(/<ol[\s>]/);
    });

    it('iterates processSteps with .map()', () => {
      expect(page).toContain('processSteps.map(');
    });

    it('renders ProcessStep component', () => {
      expect(page).toContain('<ProcessStep');
    });
  });

  describe('Témoignages section integration', () => {
    it('imports TestimonialCard component', () => {
      expect(page).toContain(
        "import TestimonialCard from '../components/TestimonialCard.astro'"
      );
    });

    it('imports testimonials data', () => {
      expect(page).toContain("from '../data/testimonials'");
    });

    it('imports testimonials background image', () => {
      expect(page).toContain("from '../assets/images/testimonials-bg.webp'");
    });

    it('has h2 title "Ils ont vécu SlowAdventures"', () => {
      expect(page).toContain('Ils ont vécu SlowAdventures');
    });

    it('uses background image with overlay ambre at 60%', () => {
      expect(page).toContain('bg-ambre/60');
    });

    it('has id="temoignages" for anchor navigation', () => {
      expect(page).toContain('id="temoignages"');
    });

    it('uses min-h-[70vh] for section height', () => {
      expect(page).toContain('min-h-[70vh]');
    });

    it('wraps each TestimonialCard in SectionReveal fade-up', () => {
      expect(page).toContain('animation="fade-up"');
      expect(page).toContain('<TestimonialCard');
    });

    it('maps testimonials data', () => {
      expect(page).toContain('testimonials.map(');
    });

    it('passes quote, name, tripContext props', () => {
      expect(page).toContain('quote={t.quote}');
      expect(page).toContain('name={t.name}');
      expect(page).toContain('tripContext={t.tripContext}');
    });

    it('includes CTAButton with solid variant and desktopOnly', () => {
      expect(page).toContain('variant="solid"');
      expect(page).toContain('desktopOnly={true}');
    });

    it('CTAButton uses PUBLIC_CALENDLY_URL, not #contact', () => {
      const temoignagesSection = page.slice(
        page.indexOf('id="temoignages"'),
        page.indexOf('id="tarifs"')
      );
      expect(temoignagesSection).toContain(
        'href={import.meta.env.PUBLIC_CALENDLY_URL}'
      );
      expect(temoignagesSection).not.toContain('href="#contact"');
    });

    it('uses Image component for background with lazy loading', () => {
      expect(page).toContain('src={testimonialsBg}');
      expect(page).toContain('loading="lazy"');
    });

    it('uses responsive grid for cards', () => {
      expect(page).toContain('grid-cols-1');
      expect(page).toContain('md:grid-cols-2');
      expect(page).toContain('lg:grid-cols-3');
    });
  });

  describe('Pricing section integration', () => {
    it('imports PricingRow component', () => {
      expect(page).toContain(
        "import PricingRow from '../components/PricingRow.astro'"
      );
    });

    it('imports pricingRows data', () => {
      expect(page).toContain("from '../data/pricing'");
    });

    it('has h2 title "Ici, on est transparent"', () => {
      expect(page).toContain('Ici, on est transparent');
    });

    it('has id="tarifs" for anchor navigation', () => {
      expect(page).toContain('id="tarifs"');
    });

    it('uses bg-creme background', () => {
      expect(page).toContain('bg-creme');
    });

    it('uses SectionReveal with stagger animation for pricing', () => {
      expect(page).toContain('animation="stagger"');
    });

    it('uses <dl> definition list for pricing', () => {
      expect(page).toMatch(/<dl[\s>]/);
    });

    it('maps pricingRows data', () => {
      expect(page).toContain('pricingRows.map(');
    });

    it('passes label, price, description props', () => {
      expect(page).toContain('label={row.label}');
      expect(page).toContain('price={row.price}');
      expect(page).toContain('description={row.description}');
    });

    it('uses max-w-3xl for pricing layout', () => {
      expect(page).toContain('max-w-3xl');
    });
  });

  describe('CalendlyModal integration', () => {
    it('imports CalendlyModal component', () => {
      expect(page).toContain(
        "import CalendlyModal from '../components/CalendlyModal.astro'"
      );
    });

    it('renders CalendlyModal component', () => {
      expect(page).toContain('<CalendlyModal');
    });

    it('places CalendlyModal after </main> (outside main content)', () => {
      const mainCloseIdx = page.indexOf('</main>');
      const modalIdx = page.indexOf('<CalendlyModal');
      expect(modalIdx).toBeGreaterThan(mainCloseIdx);
    });

    it('places CalendlyModal before StickyMobileCTA', () => {
      const modalIdx = page.indexOf('<CalendlyModal');
      const stickyIdx = page.indexOf('<StickyMobileCTA');
      expect(modalIdx).toBeLessThan(stickyIdx);
    });

    it('places CalendlyModal before </BaseLayout>', () => {
      const modalIdx = page.indexOf('<CalendlyModal');
      const layoutCloseIdx = page.indexOf('</BaseLayout>');
      expect(modalIdx).toBeLessThan(layoutCloseIdx);
    });
  });

  describe('StickyMobileCTA integration', () => {
    it('imports StickyMobileCTA component', () => {
      expect(page).toContain(
        "import StickyMobileCTA from '../components/StickyMobileCTA.astro'"
      );
    });

    it('renders StickyMobileCTA component', () => {
      expect(page).toContain('<StickyMobileCTA');
    });

    it('places StickyMobileCTA after </main> (outside main content)', () => {
      const mainCloseIdx = page.indexOf('</main>');
      const stickyIdx = page.indexOf('<StickyMobileCTA');
      expect(stickyIdx).toBeGreaterThan(mainCloseIdx);
    });

    it('places StickyMobileCTA before </BaseLayout>', () => {
      const stickyIdx = page.indexOf('<StickyMobileCTA');
      const layoutCloseIdx = page.indexOf('</BaseLayout>');
      expect(stickyIdx).toBeLessThan(layoutCloseIdx);
    });
  });

  describe('Section CTA finale integration', () => {
    it('has section with id="cta-final"', () => {
      expect(page).toContain('id="cta-final"');
    });

    it('has aria-labelledby="heading-cta-final" and matching heading id', () => {
      expect(page).toContain('aria-labelledby="heading-cta-final"');
      expect(page).toContain('id="heading-cta-final"');
    });

    it('uses bg-warm-black background', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('bg-warm-black');
    });

    it('uses sa-section-padding', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('sa-section-padding');
    });

    it('uses SectionReveal with scale-in animation', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('animation="scale-in"');
    });

    it('has h2 title "Ton prochain voyage commence ici"', () => {
      expect(page).toContain('Ton prochain voyage commence ici');
    });

    it('has CTAButton with variant="solid" and size="default"', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('variant="solid"');
      expect(ctaSection).toContain('size="default"');
    });

    it('has CTAButton with PUBLIC_CALENDLY_URL href', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain(
        'href={import.meta.env.PUBLIC_CALENDLY_URL}'
      );
    });

    it('has subtext "30 min, gratuit, sans engagement"', () => {
      expect(page).toContain('subtext="30 min, gratuit, sans engagement"');
    });

    it('does NOT have desktopOnly on CTA finale button', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).not.toContain('desktopOnly');
    });
  });

  describe('EmailCapture integration', () => {
    it('imports EmailCapture component', () => {
      expect(page).toContain(
        "import EmailCapture from '../components/EmailCapture.astro'"
      );
    });

    it('renders EmailCapture component', () => {
      expect(page).toContain('<EmailCapture');
    });

    it('places EmailCapture after CTA final section (inside main)', () => {
      const ctaFinalCloseIdx = page.lastIndexOf(
        '</section>',
        page.indexOf('<EmailCapture')
      );
      const emailIdx = page.indexOf('<EmailCapture');
      const mainCloseIdx = page.indexOf('</main>');
      expect(emailIdx).toBeGreaterThan(ctaFinalCloseIdx);
      expect(emailIdx).toBeLessThan(mainCloseIdx);
    });

    it('wraps EmailCapture in SectionReveal', () => {
      const emailIdx = page.indexOf('<EmailCapture');
      const beforeEmail = page.slice(Math.max(0, emailIdx - 200), emailIdx);
      expect(beforeEmail).toContain('<SectionReveal');
    });

    it('renders sections in order: CTA finale → Email Capture → </main>', () => {
      const ctaFinalIdx = page.indexOf('id="cta-final"');
      const emailIdx = page.indexOf('<EmailCapture');
      const mainCloseIdx = page.indexOf('</main>');
      expect(ctaFinalIdx).toBeGreaterThan(-1);
      expect(emailIdx).toBeGreaterThan(ctaFinalIdx);
      expect(mainCloseIdx).toBeGreaterThan(emailIdx);
    });
  });
});
