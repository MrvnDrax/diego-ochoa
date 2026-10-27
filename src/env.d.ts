/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_TAG_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_CONVERSION_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL?: string;
  readonly PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL?: string;
  readonly PUBLIC_GOOGLE_ADS_FORM_CONVERSION_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
