export const prerender = false;

import type { APIRoute } from 'astro';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/contacts';
const BREVO_LIST_ID = 5;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Email invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[slow-adventures] BREVO_API_KEY manquante');
    return new Response(JSON.stringify({ error: 'Configuration serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('[slow-adventures] Brevo error:', response.status, err);
    return new Response(JSON.stringify({ error: 'Brevo API error' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 201 Created ou 204 No Content
  if (response.status === 204) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json().catch(() => ({}));
  return new Response(JSON.stringify({ success: true, id: data.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
