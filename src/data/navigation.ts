export type NavigationHref =
  | '/'
  | '/diego-ochoa'
  | '/servicios'
  | '/ubicaciones'
  | '/preguntas-frecuentes'
  | '/contacto'
  | '/aviso-de-privacidad';

export interface NavigationItem {
  label: string;
  shortLabel?: string;
  href: NavigationHref;
}

export const mainNavigation = [
  {
    label: 'Inicio',
    href: '/',
  },
  {
    label: 'Diego Ochoa',
    href: '/diego-ochoa',
  },
  {
    label: 'Servicios',
    href: '/servicios',
  },
  {
    label: 'Ubicaciones',
    href: '/ubicaciones',
  },
  {
    label: 'Preguntas frecuentes',
    shortLabel: 'Preguntas',
    href: '/preguntas-frecuentes',
  },
  {
    label: 'Contacto',
    href: '/contacto',
  },
] satisfies NavigationItem[];

export const legalNavigation = [
  {
    label: 'Aviso de privacidad',
    href: '/aviso-de-privacidad',
  },
] satisfies NavigationItem[];
