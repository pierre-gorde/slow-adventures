import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Stub env before module import
vi.stubEnv('PUBLIC_GA4_MEASUREMENT_ID', 'G-TEST123');

import {
  trackCTAClick,
  trackScrollDepth,
  trackEmailCapture,
  trackUTM,
  trackCalendlyComplete,
  __test__ as __testExport,
} from '../../src/lib/analytics';

// Always defined in test environment (import.meta.env.DEV = true)
const __test__ = __testExport!;

const mockGtag = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  __test__.resetState();
  window.gtag = mockGtag;
  window.dataLayer = [];
});

afterEach(() => {
  // Clean up scripts injected by loadGA4
  document.head.querySelectorAll('script[src*="googletagmanager"]').forEach((s) => s.remove());
});

describe('analytics.ts — Module exports', () => {
  it('exports the 5 tracking functions', () => {
    expect(typeof trackCTAClick).toBe('function');
    expect(typeof trackScrollDepth).toBe('function');
    expect(typeof trackEmailCapture).toBe('function');
    expect(typeof trackUTM).toBe('function');
    expect(typeof trackCalendlyComplete).toBe('function');
  });
});

describe('analytics.ts — Tracking functions when GA4 is loaded', () => {
  beforeEach(() => {
    __test__.loadGA4('G-TEST123');
    window.gtag = mockGtag;
    mockGtag.mockClear();
  });

  it('trackCTAClick sends cta_click event', () => {
    trackCTAClick();
    expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click');
  });

  it('trackCTAClick sends cta_click event with label', () => {
    trackCTAClick('hero');
    expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', { cta_label: 'hero' });
  });

  it('trackScrollDepth sends scroll_depth event with section name', () => {
    trackScrollDepth('hero');
    expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_depth', { section: 'hero' });
  });

  it('trackScrollDepth does not track the same section twice', () => {
    trackScrollDepth('destinations');
    trackScrollDepth('destinations');
    expect(mockGtag).toHaveBeenCalledTimes(1);
  });

  it('trackEmailCapture sends email_capture event', () => {
    trackEmailCapture();
    expect(mockGtag).toHaveBeenCalledWith('event', 'email_capture');
  });

  it('trackCalendlyComplete sends calendly_complete event', () => {
    trackCalendlyComplete();
    expect(mockGtag).toHaveBeenCalledWith('event', 'calendly_complete');
  });
});

describe('analytics.ts — trackUTM', () => {
  beforeEach(() => {
    __test__.loadGA4('G-TEST123');
    window.gtag = mockGtag;
    mockGtag.mockClear();
  });

  it('extracts UTM parameters and sends utm_params event', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?utm_source=google&utm_medium=cpc&utm_campaign=launch' },
      writable: true,
    });

    trackUTM();
    expect(mockGtag).toHaveBeenCalledWith('event', 'utm_params', {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'launch',
    });
  });

  it('does nothing when no UTM parameters are present', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '' },
      writable: true,
    });

    trackUTM();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('handles partial UTM parameters (only utm_source)', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?utm_source=newsletter' },
      writable: true,
    });

    trackUTM();
    expect(mockGtag).toHaveBeenCalledWith('event', 'utm_params', {
      utm_source: 'newsletter',
      utm_medium: '',
      utm_campaign: '',
    });
  });
});

describe('analytics.ts — Graceful degradation (GA4 not loaded)', () => {
  it('trackCTAClick is silent when GA4 is not loaded', () => {
    trackCTAClick();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('trackScrollDepth is silent and does NOT mark section as seen when GA4 is not loaded', () => {
    // ga4Loaded is false — section should be silently ignored without side effects
    trackScrollDepth('test-section');
    expect(mockGtag).not.toHaveBeenCalled();

    // After consent, the section should be trackable (not permanently lost)
    __test__.loadGA4('G-TEST123');
    window.gtag = mockGtag;
    mockGtag.mockClear();

    trackScrollDepth('test-section');
    expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_depth', { section: 'test-section' });
  });

  it('trackEmailCapture is silent when GA4 is not loaded', () => {
    trackEmailCapture();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('trackCalendlyComplete is silent when GA4 is not loaded', () => {
    trackCalendlyComplete();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('trackUTM is silent when GA4 is not loaded', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?utm_source=test' },
      writable: true,
    });
    trackUTM();
    expect(mockGtag).not.toHaveBeenCalled();
  });
});

describe('analytics.ts — Error handling', () => {
  it('catches gtag errors and logs via console.warn', () => {
    __test__.loadGA4('G-TEST123');
    const throwingGtag = vi.fn(() => {
      throw new Error('gtag failure');
    });
    window.gtag = throwingGtag;

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    trackCTAClick();
    expect(warnSpy).toHaveBeenCalledWith('[slow-adventures]', expect.any(Error));
    warnSpy.mockRestore();
  });
});

describe('analytics.ts — loadGA4', () => {
  it('loads GA4 and sets ga4Loaded to true', () => {
    expect(__test__.ga4Loaded).toBe(false);
    __test__.loadGA4('G-TEST123');
    expect(__test__.ga4Loaded).toBe(true);
  });

  it('does not double-load GA4 (idempotence)', () => {
    __test__.loadGA4('G-TEST123');
    const scriptCount = document.head.querySelectorAll('script[src*="googletagmanager"]').length;
    __test__.loadGA4('G-TEST123');
    const scriptCountAfter = document.head.querySelectorAll('script[src*="googletagmanager"]').length;
    expect(scriptCountAfter).toBe(scriptCount);
  });

  it('does not load with empty measurement ID', () => {
    __test__.loadGA4('');
    expect(__test__.ga4Loaded).toBe(false);
  });

  it('rejects invalid measurement ID format', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    __test__.loadGA4('INVALID-ID');
    expect(__test__.ga4Loaded).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      '[slow-adventures]',
      expect.stringContaining('Invalid GA4 measurement ID')
    );
    warnSpy.mockRestore();
  });

  it('injects gtag.js script tag', () => {
    __test__.loadGA4('G-TEST123');
    const script = document.head.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]');
    expect(script).not.toBeNull();
  });

});

describe('analytics.ts — GA4 loads immediately', () => {
  it('init code calls loadGA4 directly', () => {
    const source = readFileSync(
      resolve(__dirname, '../../src/lib/analytics.ts'),
      'utf-8'
    );
    expect(source).toContain('loadGA4(measurementId)');
  });

  it('does not gate GA4 loading behind consent', () => {
    const source = readFileSync(
      resolve(__dirname, '../../src/lib/analytics.ts'),
      'utf-8'
    );
    expect(source).not.toContain("localStorage.getItem('sa_consent')");
    expect(source).not.toContain("'sa:consent-accepted'");
  });
});

describe('analytics.ts — CTA click event delegation', () => {
  it('click on [data-cta] element triggers cta_click event', () => {
    __test__.loadGA4('G-TEST123');
    window.gtag = mockGtag;
    mockGtag.mockClear();

    const btn = document.createElement('button');
    btn.setAttribute('data-cta', 'test-cta');
    document.body.appendChild(btn);

    btn.click();
    expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', { cta_label: 'test-cta' });

    btn.remove();
  });

  it('click on child of [data-cta] element bubbles up correctly', () => {
    __test__.loadGA4('G-TEST123');
    window.gtag = mockGtag;
    mockGtag.mockClear();

    const link = document.createElement('a');
    link.setAttribute('data-cta', '');
    const span = document.createElement('span');
    span.textContent = 'Click me';
    link.appendChild(span);
    document.body.appendChild(link);

    span.click();
    // Empty data-cta value → no label
    expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click');

    link.remove();
  });
});

describe('analytics.ts — IntersectionObserver setup (source verification)', () => {
  it('creates IntersectionObserver for section[id] elements with threshold 0.3', () => {
    const source = readFileSync(
      resolve(__dirname, '../../src/lib/analytics.ts'),
      'utf-8'
    );
    expect(source).toContain("document.querySelectorAll<HTMLElement>('section[id]')");
    expect(source).toContain('threshold: 0.3');
  });

  it('checks for IntersectionObserver support before creating observer', () => {
    const source = readFileSync(
      resolve(__dirname, '../../src/lib/analytics.ts'),
      'utf-8'
    );
    expect(source).toContain("'IntersectionObserver' in window");
  });
});

describe('analytics.ts — __test__ export', () => {
  it('is only available in DEV mode (source verification)', () => {
    const source = readFileSync(
      resolve(__dirname, '../../src/lib/analytics.ts'),
      'utf-8'
    );
    expect(source).toContain('import.meta.env.DEV');
  });
});
