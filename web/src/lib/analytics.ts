// web/src/lib/analytics.ts — Events custom GA4
// Le script gtag.js est chargé directement dans BaseLayout.astro <head>

// --- Global type declarations ---
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// --- Internal state ---
const trackedSections = new Set<string>();

// --- Safe gtag wrapper ---
function safeGtag(...args: unknown[]): void {
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag(...args);
  } catch (error) {
    console.warn('[slow-adventures]', error);
  }
}

// --- Exported tracking functions ---

export function trackCTAClick(label?: string): void {
  if (label) {
    safeGtag('event', 'cta_click', { cta_label: label });
  } else {
    safeGtag('event', 'cta_click');
  }
}

export function trackScrollDepth(section: string): void {
  if (trackedSections.has(section)) return;
  trackedSections.add(section);
  safeGtag('event', 'scroll_depth', { section });
}

export function trackEmailCapture(): void {
  safeGtag('event', 'email_capture');
}

export function trackUTM(): void {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  if (!source && !medium && !campaign) return;
  safeGtag('event', 'utm_params', {
    utm_source: source ?? '',
    utm_medium: medium ?? '',
    utm_campaign: campaign ?? '',
  });
}

export function trackCalendlyComplete(): void {
  safeGtag('event', 'calendly_complete');
}

// --- Scroll depth IntersectionObserver ---
function initScrollTracking(): void {
  if (!('IntersectionObserver' in window)) return;

  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) trackScrollDepth(id);
        }
      }
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

// --- CTA click event delegation ---
function initCTATracking(): void {
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cta]');
    if (target) {
      const label = target.getAttribute('data-cta') || undefined;
      trackCTAClick(label);
    }
  });
}

// --- Auto-initialization ---
initScrollTracking();
initCTATracking();
trackUTM();
