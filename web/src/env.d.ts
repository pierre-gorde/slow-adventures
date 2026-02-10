/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BREVO_API_KEY: string;
  readonly PUBLIC_CALENDLY_URL: string;
  readonly PUBLIC_GA4_MEASUREMENT_ID: string;
  readonly SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
