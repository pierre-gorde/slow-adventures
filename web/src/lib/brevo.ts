import type { BrevoResult } from '../types/index';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/contacts';
// ID de la liste Brevo « Newsletter Slow Adventures » — configurable dans Brevo > Contacts > Listes
const BREVO_LIST_ID = 5;

export async function subscribeToNewsletter(
  email: string
): Promise<BrevoResult> {
  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': import.meta.env.PUBLIC_BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string }).message ??
          `Brevo API error: ${response.status}`
      );
    }

    const data = (await response.json()) as { id: number };
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[slow-adventures]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
