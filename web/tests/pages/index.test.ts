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
    expect(page).toContain(
      'Des circuits conçus par Elena pour mieux voyager aux États-Unis et au Canada.'
    );
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
        'subtitle="Des circuits conçus par Elena pour mieux voyager aux États-Unis et au Canada. Tu choisis, on s’occupe du reste."'
      );
    });

    it('imports hero poster from assets', () => {
      expect(page).toContain("from '../assets/images/hero-poster.webp'");
    });

    it('uses getImage for poster preload optimization', () => {
      expect(page).toContain("import { getImage } from 'astro:assets'");
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
      expect(page).toContain('title="Hello"');
    });

    it('points the bio button to the circuits page', () => {
      expect(page).toContain('ctaHref={CIRCUITS_URL}');
      expect(page).toContain('ctaText="Découvre les circuits"');
      expect(page).toContain('ctaCalendly={false}');
    });
  });

  describe('Circuits section integration', () => {
    it('imports and renders CircuitCarousel', () => {
      expect(page).toContain(
        "import CircuitCarousel from '../components/CircuitCarousel.astro'"
      );
      expect(page).toContain('<CircuitCarousel />');
    });

    it('no longer lists destinations on the homepage', () => {
      expect(page).not.toContain('<DestinationBlock');
      expect(page).not.toContain("getCollection('destinations')");
    });
  });

  describe('section IDs for accessibility and anchoring', () => {
    it('passes id="elena" prop to ElenaSection', () => {
      expect(page).toContain('id="elena"');
    });

    it('has id="processus" on the process section', () => {
      expect(page).toContain('id="processus"');
    });

    it('no longer has the pricing section', () => {
      expect(page).not.toContain('id="tarifs"');
    });

    it('has id="cta-final" on the CTA finale section', () => {
      expect(page).toContain('id="cta-final"');
    });
  });

  describe('aria-labelledby on all sections', () => {
    it('processus section has aria-labelledby="heading-processus"', () => {
      expect(page).toContain('aria-labelledby="heading-processus"');
      expect(page).toContain('id="heading-processus"');
    });

    it('cta-final section has aria-labelledby="heading-cta-final"', () => {
      expect(page).toContain('aria-labelledby="heading-cta-final"');
      expect(page).toContain('id="heading-cta-final"');
    });
  });

  describe('section rendering order', () => {
    it('renders sections in order: Hero → Elena → Circuits → Processus → Avantages → CTA finale → Email Capture → FAQ', () => {
      const heroIdx = page.indexOf('<HeroSection');
      const elenaIdx = page.indexOf('<ElenaSection');
      const destIdx = page.indexOf('<CircuitCarousel');
      const processIdx = page.indexOf('Comment ton rêve prend vie');
      const pricingIdx = page.indexOf('id="avantages"');
      const ctaFinalIdx = page.indexOf('id="cta-final"');
      const emailCaptureIdx = page.indexOf('<EmailCapture');
      const faqIdx = page.indexOf('<FaqSection');
      expect(heroIdx).toBeGreaterThan(-1);
      expect(elenaIdx).toBeGreaterThan(heroIdx);
      expect(destIdx).toBeGreaterThan(elenaIdx);
      expect(processIdx).toBeGreaterThan(destIdx);
      expect(pricingIdx).toBeGreaterThan(processIdx);
      expect(ctaFinalIdx).toBeGreaterThan(pricingIdx);
      expect(emailCaptureIdx).toBeGreaterThan(ctaFinalIdx);
      expect(faqIdx).toBeGreaterThan(emailCaptureIdx);
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

    it('has h2 title "Comment ton rêve prend vie"', () => {
      expect(page).toContain('Comment ton rêve prend vie');
    });

    it('animates process steps with a GSAP scroll timeline on #process-list', () => {
      expect(page).toContain('id="process-list"');
      expect(page).toContain("getElementById('process-list')");
      expect(page).toContain("'[data-process-step]'");
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

    it('has h2 title "Ton prochain rêve commence ici"', () => {
      expect(page).toContain('Ton prochain rêve commence ici');
    });

    it('has CTAButton with variant="solid" and size="default"', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('variant="solid"');
      expect(ctaSection).toContain('size="default"');
    });

    it('has CTAButton linking to the circuits page', () => {
      const ctaSection = page.slice(page.indexOf('id="cta-final"'));
      expect(ctaSection).toContain('href={CIRCUITS_URL}');
      expect(ctaSection).toContain('text="Choisis ton circuit"');
    });

    it('has the new subtext under the button', () => {
      expect(page).toContain(
        'subtext="Tout est déjà pensé pour toi, il ne te reste qu’à choisir."'
      );
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

  describe('FaqSection integration', () => {
    it('imports FaqSection component', () => {
      expect(page).toContain(
        "import FaqSection from '../components/FaqSection.astro'"
      );
    });

    it('renders FaqSection component', () => {
      expect(page).toContain('<FaqSection />');
    });

    it('places FaqSection after EmailCapture and inside main', () => {
      const emailIdx = page.indexOf('<EmailCapture');
      const faqIdx = page.indexOf('<FaqSection');
      const mainCloseIdx = page.indexOf('</main>');
      expect(faqIdx).toBeGreaterThan(emailIdx);
      expect(faqIdx).toBeLessThan(mainCloseIdx);
    });
  });

  describe('FAQ Schema JSON-LD', () => {
    it('imports faqLd from the faq data module', () => {
      expect(page).toContain("import { faqLd } from '../data/faq'");
    });

    it('passes extraLd={faqLd} to BaseLayout', () => {
      expect(page).toContain('extraLd={faqLd}');
    });
  });
});
