import { contact } from '@data/contact';
export interface BookingProfile { provider: 'whatsapp'; label: string; href: string; }
export const doctoraliaProfile = { provider: 'whatsapp', label: 'WhatsApp', href: contact.whatsappBaseUrl } satisfies BookingProfile;
