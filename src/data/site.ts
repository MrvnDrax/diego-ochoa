export interface SiteData {
  brandName: string;
  doctorFullName: string;
  specialty: string;
  htmlLang: 'es-MX';
  url: `https://${string}`;
  defaultSocialImagePath: `/${string}`;
}

export const site = {
  brandName: 'Diego Ochoa',
  doctorFullName: 'Diego Enrique Pérez Ochoa',
  specialty: 'Gestiones inmobiliarias',
  htmlLang: 'es-MX',
  url: (process.env.PUBLIC_SITE_URL || 'https://diego-ochoa.example') as `https://${string}`,
  defaultSocialImagePath: '/images/diego-ochoa-social.png',
} satisfies SiteData;
