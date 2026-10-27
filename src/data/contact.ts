export interface ContactData {
  phoneDisplay: string;
  phoneE164: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappBaseUrl: string;
}

export const contact = {
  phoneDisplay: '993 252 2954',
  phoneE164: '+529932522954',
  phoneHref: 'tel:+529932522954',
  whatsappNumber: '529932522954',
  whatsappBaseUrl: 'https://wa.me/529932522954',
} satisfies ContactData;
