import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock import.meta.env before importing the module
vi.stubGlobal('import', {
  meta: { env: { PUBLIC_BREVO_API_KEY: 'xkeysib-test-key-123' } },
});

// We need to test the source file directly via readFileSync for import.meta.env
// AND test the function logic via dynamic import with mocked fetch
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

  it('uses correct Brevo API endpoint', () => {
    expect(brevoSource).toContain('https://api.brevo.com/v3/contacts');
  });

  it('uses api-key header (NOT Authorization)', () => {
    expect(brevoSource).toContain("'api-key'");
    expect(brevoSource).not.toContain('Authorization');
    expect(brevoSource).not.toContain('Bearer');
  });

  it('uses Content-Type application/json header', () => {
    expect(brevoSource).toContain("'Content-Type': 'application/json'");
  });

  it('accesses PUBLIC_BREVO_API_KEY from import.meta.env', () => {
    expect(brevoSource).toContain('import.meta.env.PUBLIC_BREVO_API_KEY');
  });

  it('sends email in the request body', () => {
    expect(brevoSource).toContain('email');
  });

  it('sends listIds in the request body', () => {
    expect(brevoSource).toContain('listIds');
  });

  it('sends updateEnabled: true in the request body', () => {
    expect(brevoSource).toContain('updateEnabled: true');
  });

  it('uses try/catch for error handling', () => {
    expect(brevoSource).toContain('try');
    expect(brevoSource).toContain('catch');
  });

  it('logs errors with console.error and [slow-adventures] prefix', () => {
    expect(brevoSource).toContain("console.error('[slow-adventures]'");
  });

  it('returns success: true with id on success', () => {
    expect(brevoSource).toContain('success: true');
  });

  it('returns success: false with error on failure', () => {
    expect(brevoSource).toContain('success: false');
  });

  it('uses POST method', () => {
    expect(brevoSource).toContain("method: 'POST'");
  });

  it('does not implement automatic retry', () => {
    expect(brevoSource).not.toContain('retry');
    expect(brevoSource).not.toContain('setTimeout');
  });
});

describe('subscribeToNewsletter function behavior', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
    vi.stubEnv('PUBLIC_BREVO_API_KEY', 'xkeysib-test-key-123');
  });

  it('calls fetch with correct URL and headers on success (201)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 42 }),
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('test@example.com');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect('api-key' in options.headers).toBe(true);
    expect(options.headers['api-key']).toBeDefined();

    const body = JSON.parse(options.body);
    expect(body.email).toBe('test@example.com');
    expect(body.listIds).toBeDefined();
    expect(body.updateEnabled).toBe(true);

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
    expect(consoleSpy).toHaveBeenCalledWith(
      '[slow-adventures]',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it('returns error result on server error (400)', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid email' }),
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('bad-email');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
    consoleSpy.mockRestore();
  });

  it('returns error result on rate limit (429)', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ message: 'Too many requests' }),
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('test@example.com');

    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });

  it('handles non-JSON error response gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('Not JSON');
      },
    });

    const { subscribeToNewsletter } = await import('../../src/lib/brevo');
    const result = await subscribeToNewsletter('test@example.com');

    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
