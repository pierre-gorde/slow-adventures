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
    expect(circuitsData).not.toMatch(/duree: '1[56] jours'/);
    expect(circuitsData).toContain("nom: 'Les Rocheuses canadiennes'");
    expect(circuitsData.match(/duree: '2 semaines'/g)).toHaveLength(2);
  });
});

describe('circuit content', () => {
  const page = read('../../src/pages/circuits/[slug].astro');

  it('describes two days in Las Vegas, not one evening', () => {
    expect(circuitsData).toContain('Deux jours pour le contraste');
    expect(circuitsData).not.toContain('Une soirée pour le contraste');
  });

  it('offers the one-week extension on the US parks circuit', () => {
    const parcs = circuitsData.slice(
      circuitsData.indexOf("slug: 'parcs-nationaux-us'"),
      circuitsData.indexOf("slug: 'rocheuses-canadiennes'")
    );
    expect(parcs).toContain('Le petit plus');
    expect(parcs).toContain('Prolonge ton voyage d’une semaine');
    expect(parcs).not.toContain("label: 'Prolonge ton voyage d’une semaine'");
    expect(circuitsData).toMatch(/extra:\s*'Prolonger d’une semaine/);
  });

  it('offers "Un mélange" as an accommodation choice on both circuits', () => {
    const matches = circuitsData.match(/'Hôtels supérieurs',\s*'Un mélange',/g);
    expect(matches).toHaveLength(2);
  });

  it('offers WhatsApp under the Calendly link on circuit pages', () => {
    expect(page).toContain('Tu préfères par WhatsApp');
    expect(page).toContain(
      'href={whatsappLink(whatsappMessageCircuit(circuit.nom))}'
    );
  });

  it('offers WhatsApp on the circuits listing page too', () => {
    const listing = read('../../src/pages/circuits/index.astro');
    expect(listing).toContain('Tu préfères par WhatsApp');
    expect(listing).toContain('href={whatsappLink()}');
  });

  it('shows the included and price sections on every circuit page', () => {
    expect(page).toContain('Ce qui est inclus');
    expect(page).toContain('Combien ça coûte');
    expect(circuitsData).toContain('export const circuitInclus');
    expect(circuitsData).toContain("'Les vols'");
  });
});

describe('road time and children ages', () => {
  it('says "de route" on every step with a drive', () => {
    const routes = [...circuitsData.matchAll(/route: '([^']*)'/g)].map(
      (m) => m[1]
    );
    expect(routes.length).toBeGreaterThan(10);
    routes.forEach((r) => expect(r).toContain('de route'));
  });

  it('asks the age of each child and still sends it in age-enfants', () => {
    expect(form).toContain('Précise l’âge de chacun pendant le voyage');
    expect(form).toContain('moins de 18 ans');
    expect(form).toContain('name="age-enfants"');
    expect(netlifyForms).toContain('name="age-enfants"');
  });
});

describe('New York Essentials', () => {
  const page = read('../../src/pages/circuits/[slug].astro');

  it('is listed as a circuit with its own content', () => {
    expect(circuitsData).toContain("slug: 'new-york-essentials'");
    expect(circuitsData).toContain("nom: 'New York Essentials'");
    expect(circuitsData).toContain("duree: '6 jours'");
    expect(circuitsData).toContain('Lever de soleil sur le Brooklyn Bridge');
  });

  it('shows the 10 photos from Elena in its gallery', () => {
    const files = circuitsData.match(
      /circuits\/new-york\/\d{2}-[a-z0-9-]+\.webp/g
    );
    expect(new Set(files).size).toBe(10);
    expect(circuitsData).toContain('nycCentralParkElena');
  });

  it('keeps the New York day-by-day simple: no clock times, no shop list', () => {
    const nyc = circuitsData.slice(
      circuitsData.indexOf("slug: 'new-york-essentials'")
    );
    const etapes = nyc.slice(nyc.indexOf('etapes:'), nyc.indexOf('petitPlus:'));
    expect(etapes).not.toMatch(/\d[\s\u00a0]h\b|vers \d|ouvre vers/);
    expect(etapes).not.toContain('Awoke Vintage');
    expect(etapes).not.toContain('gospel');
    expect(nyc).toContain('en couple, en famille ou entre amis');
    expect(nyc).toContain('s’acclimater à la ville');
  });

  it('has a route map, the common included list and no budget tip', () => {
    const nyc = circuitsData.slice(
      circuitsData.indexOf("slug: 'new-york-essentials'")
    );
    expect(nyc).toContain('carte: nycCarte');
    expect(nyc).not.toMatch(/\n\s*inclus: \[/);
    expect(nyc).not.toContain('Budget sur place');
    expect(nyc).not.toContain('fais la demande en ligne');
  });

  it('keeps only a short "Bon à savoir" and no "Comment ça marche ?"', () => {
    const nyc = circuitsData.slice(
      circuitsData.indexOf("slug: 'new-york-essentials'")
    );
    const tips = [
      ...nyc
        .slice(nyc.indexOf('conseils:'), nyc.indexOf('options:'))
        .matchAll(/label: '([^']*)'/g),
    ].map((m) => m[1]);
    expect(tips).toEqual(['Métro', 'Pourboire', 'Formalités']);
    expect(page).toContain('Bon à savoir');
    expect(page).not.toContain('Comment ça marche');
    expect(circuitsData).not.toContain('commentCaMarche');
  });

  it('has no vehicle question; the map section stays optional', () => {
    expect(circuitsData).toMatch(/vehicules: \[\],/);
    expect(form).toContain('vehicules.length > 0');
    expect(page).toContain('circuit.carte && carteFull');
  });

  it('renders the city-trip sections only when a circuit has them', () => {
    for (const key of [
      'circuit.enBref',
      'circuit.evenements',
      'circuit.conseils',
      'circuit.petitPlus',
    ]) {
      expect(page).toContain(key);
    }
    expect(page).toContain('circuit.inclus ?? circuitInclus');
  });
});

describe('contact links', () => {
  it('uses the 15-minute Calendly event', () => {
    expect(contact).toContain(
      'https://calendly.com/elena-slowadventures/15min'
    );
  });

  it('pre-writes the WhatsApp message, naming the circuit when known', () => {
    expect(contact).toContain('export const whatsappLink');
    expect(contact).toContain('encodeURIComponent(message)');
    expect(contact).toContain(
      'Je suis intéressé(e) par le circuit « ${nomCircuit} »'
    );
    expect(contact).toContain('Je découvre tes circuits');
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

  it('asks for a required budget per person, declared for Netlify', () => {
    expect(form).toMatch(/name="budget-par-personne"[\s\S]*?required/);
    expect(netlifyForms).toContain('name="budget-par-personne"');
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
