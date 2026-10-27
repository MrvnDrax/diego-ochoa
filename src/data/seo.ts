export interface SeoData {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  openGraphLocale: 'es_MX';
}

export const seo = {
  defaultTitle: 'Diego Ochoa | Gestiones inmobiliarias',
  titleTemplate: '%s | Diego Ochoa',
  defaultDescription:
    'Orientación en compraventa, crédito para terreno, Infonavit y Mejoravit en Tabasco, Chiapas y Veracruz.',
  openGraphLocale: 'es_MX',
} satisfies SeoData;
