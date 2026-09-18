import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail } from '../../../scripts/weekly-report/email.ts';

const API_KEY = 'xkeysib-test';
const PAYLOAD = {
  from: 'rapport@slowadventures.fr',
  to: 'elena@slowadventures.fr',
  subject: 'Rapport hebdo',
  html: '<p>Bonjour</p>',
};

describe('sendEmail', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('posts a Brevo transactional email and returns its messageId', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messageId: '<msg-1@smtp-relay.mailin.fr>' }),
    });

    const messageId = await sendEmail(API_KEY, PAYLOAD);

    expect(messageId).toBe('<msg-1@smtp-relay.mailin.fr>');
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(options.method).toBe('POST');
    expect(options.headers['api-key']).toBe(API_KEY);
    expect(options.headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(options.body);
    expect(body.sender).toEqual({
      email: 'rapport@slowadventures.fr',
      name: 'Slow Adventures — Rapport hebdo',
    });
    expect(body.to).toEqual([{ email: 'elena@slowadventures.fr' }]);
    expect(body.subject).toBe('Rapport hebdo');
    expect(body.htmlContent).toBe('<p>Bonjour</p>');
  });

  it('splits comma-separated recipients and trims them', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messageId: 'id' }),
    });

    await sendEmail(API_KEY, {
      ...PAYLOAD,
      to: 'elena@slowadventures.fr, pierre@example.com',
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.to).toEqual([
      { email: 'elena@slowadventures.fr' },
      { email: 'pierre@example.com' },
    ]);
  });

  it('adds cc recipients only when provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ messageId: 'id' }),
    });

    await sendEmail(API_KEY, { ...PAYLOAD, cc: 'pierre@example.com' });
    await sendEmail(API_KEY, PAYLOAD);

    const withCc = JSON.parse(mockFetch.mock.calls[0][1].body);
    const withoutCc = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(withCc.cc).toEqual([{ email: 'pierre@example.com' }]);
    expect(withoutCc.cc).toBeUndefined();
  });

  it('throws with the HTTP status when Brevo rejects the request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => '{"message":"Key not found"}',
    });

    await expect(sendEmail(API_KEY, PAYLOAD)).rejects.toThrow(
      'Brevo API 401 : {"message":"Key not found"}'
    );
  });
});
