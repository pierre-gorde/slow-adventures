import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const brevoSource = readFileSync(
  resolve(__dirname, '../../src/lib/brevo.ts'),
  'utf-8'
);

describe('brevo.ts source analysis', () => {
  it('exports subscribeToNewsletter function', () => {
    expect(brevoSource).toContain(
      'export async function subscribeToNewsletter'
    );
  });

  it('calls /api/subscribe endpoint (NOT Brevo directly)', () => {
    expect(brevoSource).toContain("'/api/subscribe'");
    expect(brevoSource).not.toContain('api.brevo.com');
  });

  it('does not expose any API key', () => {
    expect(brevoSource).not.toContain('api-key');
    expect(brevoSource).not.toContain('BREVO_API_KEY');
    expect(brevoSource).not.toContain('PUBLIC_BREVO_API_KEY');
  });

  it('sends email in the request body', () => {
    expect(brevoSource).toContain('email');
  });

  it('uses POST method', () => {
    expect(brevoSource).toContain("method: 'POST'");
  });

  it('uses Content-Type application/json header', () => {
    expect(brevoSource).toContain("'Content-Type': 'application/json'");
  });

  it('uses try/catch for error handling', () => {
    expect(brevoSource).toContain('try');
    expect(brevoSource).toContain('catch');
  });

  it('logs errors with console.error and [slow-adventures] prefix', () => {
    expect(brevoSource).toContain("console.error('[slow-adventures]'");
  });

  it('returns success: true on success', () => {
    expect(brevoSource).toContain('success: true');
  });

  it('returns success: false with error on failure', () => {
    expect(brevoSource).toContain('success: false');
  });
});

describe('subscribeToNewsletter function behavior', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('calls /api/subscribe with email on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, id: 42 }),
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('test@example.com');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/subscribe');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(options.body);
    expect(body.email).toBe('test@example.com');

    expect(result).toEqual({ success: true, id: 42 });
  });

  it('returns error result on network failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('test@example.com');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Network error');
    }
    consoleSpy.mockRestore();
  });

  it('returns error result on server error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Brevo API error' }),
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('bad-email');

    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
