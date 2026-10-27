export type ContactFormFieldId =
  'name' | 'phone' | 'email' | 'location' | 'message' | 'privacyAccepted';

export type ContactFormFieldType =
  'text' | 'tel' | 'email' | 'select' | 'textarea' | 'checkbox';

export type AutocompleteValue = 'name' | 'tel' | 'email';

export interface ContactFormField {
  id: ContactFormFieldId;
  label: string;
  type: ContactFormFieldType;
  required: boolean;
  autocomplete?: AutocompleteValue;
}

export interface ContactFormData {
  id: 'contact';
  privacyPath: '/aviso-de-privacidad';
  fields: ContactFormField[];
}

export const contactForm = {
  id: 'contact',
  privacyPath: '/aviso-de-privacidad',
  fields: [
    {
      id: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      autocomplete: 'name',
    },
    {
      id: 'phone',
      label: 'Teléfono',
      type: 'tel',
      required: true,
      autocomplete: 'tel',
    },
    {
      id: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: false,
      autocomplete: 'email',
    },
    {
      id: 'location',
      label: 'Zona de interés',
      type: 'select',
      required: true,
    },
    {
      id: 'message',
      label: 'Mensaje — no incluyas datos financieros sensibles',
      type: 'textarea',
      required: false,
    },
    {
      id: 'privacyAccepted',
      label: 'He leído y acepto el aviso de privacidad',
      type: 'checkbox',
      required: true,
    },
  ],
} satisfies ContactFormData;
