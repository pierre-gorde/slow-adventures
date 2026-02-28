// web/src/lib/analytics.ts — Module GA4 centralisé (FR23-27)

// --- Global type declarations ---
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// --- Internal state (ES module singleton) ---
let ga4Loaded = false;
const trackedSections = new Set<string>();

// --- Safe gtag wrapper ---
function safeGtag(...args: unknown[]): void {
  if (!ga4Loaded || typeof window.gtag !== 'function') return;
  try {
    window.gtag(...args);
  } catch (error) {
    console.warn('[slow-adventures]', error);
  }
}

// --- Load GA4 dynamically ---
function loadGA4(measurementId: string): void {
  if (!measurementId || ga4Loaded) return;
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    console.warn('[slow-adventures]', `Invalid GA4 measurement ID: ${measurementId}`);
    return;
  }
  ga4Loaded = true;

  // Grant analytics consent (defaults already set in init)
  window.gtag('consent', 'update', { analytics_storage: 'granted' });

  // Inject gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
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
  if (!ga4Loaded) return;
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

// --- UTM auto-extraction ---
function initUTMTracking(): void {
  trackUTM();
}

// --- Auto-initialization ---
function init(): void {
  const measurementId = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID ?? '';

  // Google Consent Mode v2 — set defaults at page load (before GA4 loading)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  // Check existing consent in localStorage
  try {
    const stored = localStorage.getItem('sa_consent');
    if (stored) {
      const consent = JSON.parse(stored);
      if (consent?.analytics === true) {
        loadGA4(measurementId);
      }
    }
  } catch {
    // Corrupted localStorage — ignore silently
  }

  // Listen for consent event (verify detail per architecture spec)
  document.addEventListener('sa:consent-accepted', ((e: CustomEvent) => {
    if (e.detail?.analytics) {
      loadGA4(measurementId);
      trackUTM();
    }
  }) as EventListener);

  // Initialize tracking features
  initScrollTracking();
  initCTATracking();
  initUTMTracking();
}

init();

// --- Test helpers (stripped from production builds by Vite) ---
export const __test__ = import.meta.env.DEV
  ? {
      get ga4Loaded() {
        return ga4Loaded;
      },
      resetState() {
        ga4Loaded = false;
        trackedSections.clear();
      },
      loadGA4,
      safeGtag,
    }
  : undefined;
