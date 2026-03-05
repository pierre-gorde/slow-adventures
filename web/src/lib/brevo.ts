import type { BrevoResult } from '../types/index';

export async function subscribeToNewsletter(
  email: string
): Promise<BrevoResult> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { error?: string }).error ??
          `API error: ${response.status}`
      );
    }

    const data = (await response.json()) as { success: boolean; id?: number };
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[slow-adventures]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
