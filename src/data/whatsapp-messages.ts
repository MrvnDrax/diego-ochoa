import { contact } from '@data/contact';

import type { ClinicLocation } from '@data/locations';

export interface WhatsAppMessageData {
  general: string;
}

export const whatsappMessages = {
  general:
    'Hola, Diego. Me gustaría recibir orientación sobre una gestión inmobiliaria.',
} satisfies WhatsAppMessageData;

export function createWhatsAppHref(message: string): string {
  const encodedMessage = encodeURIComponent(message);

  return `${contact.whatsappBaseUrl}?text=${encodedMessage}`;
}

export function createLocationWhatsAppMessage(
  area: ClinicLocation['area'],
): string {
  return `Hola, Diego. Me gustaría consultar sobre atención en ${area} para una gestión inmobiliaria.`;
}

export function createLocationWhatsAppHref(
  area: ClinicLocation['area'],
): string {
  const message = createLocationWhatsAppMessage(area);

  return createWhatsAppHref(message);
}

export const generalWhatsAppHref = createWhatsAppHref(whatsappMessages.general);
