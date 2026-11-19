import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p: string) => readFileSync(resolve(__dirname, p), 'utf-8');

const circuitsData = read('../../src/data/circuits.ts');
const contact = read('../../src/data/contact.ts');
const form = read('../../src/components/CircuitForm.astro');
const netlifyForms = read('../../public/__forms.html');
const astroConfig = read('../../astro.config.mjs');
const topBar = read('../../src/components/TopBar.astro');

const fieldNames = (html: string) =>
  new Set([...html.matchAll(/name="([a-z-]+)"/g)].map((m) => m[1]));

describe('circuits data', () => {
  it('defines the two published circuits', () => {
    expect(circuitsData).toContain("slug: 'parcs-nationaux-us'");
    expect(circuitsData).toContain("slug: 'rocheuses-canadiennes'");
  });

  it('uses the validated names and durations', () => {
    expect(circuitsData).toContain("nom: 'Les parcs nationaux US'");
    expect(circuitsData).toContain("duree: '16 jours'");
    expect(circuitsData).toContain("nom: 'Les Rocheuses canadiennes'");
    expect(circuitsData).toContain("duree: '15 jours'");
  });
});

describe('circuit content', () => {
  const page = read('../../src/pages/circuits/[slug].astro');

  it('describes two days in Las Vegas, not one evening', () => {
    expect(circuitsData).toContain('Deux jours pour le contraste');
    expect(circuitsData).not.toContain('Une soirée pour le contraste');
  });

  it('offers the one-week extension on the US parks circuit', () => {
    expect(circuitsData).toContain(
      "label: 'Prolonge ton voyage d’une semaine'"
    );
    expect(circuitsData).toMatch(/extra:\s*'Prolonger d’une semaine/);
  });

  it('offers "Un mélange" as an accommodation choice on both circuits', () => {
    const matches = circuitsData.match(/'Hôtels supérieurs',\s*'Un mélange',/g);
    expect(matches).toHaveLength(2);
  });

  it('shows the included and price sections on every circuit page', () => {
    expect(page).toContain('Ce qui est inclus');
    expect(page).toContain('Combien ça coûte');
    expect(circuitsData).toContain('export const circuitInclus');
    expect(circuitsData).toContain("'Les vols'");
  });
});

describe('contact links', () => {
  it('uses the 15-minute Calendly event', () => {
    expect(contact).toContain(
      'https://calendly.com/elena-slowadventures/15min'
    );
  });

  it('uses the WhatsApp number in international format', () => {
    expect(contact).toContain('https://wa.me/33652949913');
  });
});

describe('CircuitForm ↔ Netlify Forms declaration', () => {
  it('posts the same form name that Netlify knows', () => {
    expect(form).toContain("const FORM_NAME = 'demande-circuit'");
    expect(netlifyForms).toContain('name="demande-circuit"');
    expect(netlifyForms).toContain('data-netlify="true"');
  });

  it('declares every field of the visible form in public/__forms.html', () => {
    const declared = fieldNames(netlifyForms);
    for (const field of fieldNames(form)) {
      expect(declared, `champ manquant : ${field}`).toContain(field);
    }
  });

  it('sends the circuit name as a quoted hidden value', () => {
    expect(form).toContain('name="circuit" value={circuit.nom}');
  });
});

describe('consent and privacy (RGPD)', () => {
  const privacy = read('../../src/pages/politique-confidentialite.astro');

  it('tells the visitor their data goes to the partner agency for the quote', () => {
    expect(form).toContain(
      'transmises à l’agence partenaire chargée de mon devis'
    );
    expect(form).toContain('href="/politique-confidentialite"');
  });

  it('explains the transfer to the partner agency in the privacy policy', () => {
    expect(privacy).toContain('Transmission à notre agence partenaire');
    expect(privacy).toContain('chargée d’établir ton devis');
  });
});

describe('navigation', () => {
  it('redirects the old destinations listing to the circuits page', () => {
    expect(astroConfig).toContain("'/destinations': '/circuits/'");
  });

  it('shows a "Circuits" menu instead of "Destinations"', () => {
    expect(topBar).toContain('Circuits');
    expect(topBar).not.toContain('Toutes les destinations');
  });
});
