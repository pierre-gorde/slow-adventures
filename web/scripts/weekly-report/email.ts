import {
  BREVO_EMAIL_API_URL,
  EMAIL_SENDER_NAME,
  RECIPIENTS_SEPARATOR,
} from './report.const.ts';

export type EmailPayload = {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  html: string;
};

function toRecipients(list: string): { email: string }[] {
  return list
    .split(RECIPIENTS_SEPARATOR)
    .map((email) => ({ email: email.trim() }));
}

export async function sendEmail(
  apiKey: string,
  payload: EmailPayload
): Promise<string> {
  const response = await fetch(BREVO_EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: payload.from, name: EMAIL_SENDER_NAME },
      to: toRecipients(payload.to),
      ...(payload.cc ? { cc: toRecipients(payload.cc) } : {}),
      subject: payload.subject,
      htmlContent: payload.html,
    }),
  });
  if (!response.ok) {
    throw new Error(`Brevo API ${response.status} : ${await response.text()}`);
  }
  const { messageId } = (await response.json()) as { messageId: string };
  return messageId;
}
