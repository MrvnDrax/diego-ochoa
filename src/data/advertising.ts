import type { BannerConfig, PromotionConfig } from '@emeza/astro-ad-modules';
import { createWhatsAppHref } from '@data/whatsapp-messages';
export const campaignStatus = 'Orientación inicial. Condiciones sujetas a cada caso e institución.';
export const firstVisitHref = createWhatsAppHref('Hola, Diego. Vi tu sitio y quiero consultar una gestión inmobiliaria.');
export const secondOpinionHref = createWhatsAppHref('Hola, Diego. Quiero revisar documentos de una operación inmobiliaria.');
export const prosthesisHref = createWhatsAppHref('Hola, Diego. Quiero conocer opciones para comprar una vivienda o terreno.');
export const advertising = { enabled: true, primaryEnabled: true, servicesEnabled: true, railEnabled: true, popupEnabled: true, popupDelayMs: 5000, popupFrequency: 'always', railReopenDelayMs: 20000 } as const;
const theme = { background: '#1b325f', foreground: '#e9f2f9', accent: '#f26c4f', surface: '#3a89c9' };
export const adArtwork = { vertical: { width: 793, height: 1983 }, mobile: { width: 2172, height: 724 }, popup: { width: 1122, height: 1402 } } as const;
const horizontalMedia = { src: '/images/advertising/diego-horizontal.png', alt: 'Diego Ochoa: tu próximo inmueble, con más claridad. Compraventa, terrenos y crédito. Consultar por WhatsApp.', ...adArtwork.mobile };
const mobileMedia = { src: '/images/advertising/diego-mobile-background.png', alt: 'Diego Ochoa: tu próximo inmueble, con más claridad. Escríbeme.', ...adArtwork.mobile };
const verticalMedia = { src: '/images/advertising/diego-vertical.png', alt: 'Diego Ochoa: compra con claridad. Casa, terreno y crédito. Escríbeme.', ...adArtwork.vertical };
const action = { href: firstVisitHref, target: '_blank' as const, ctaLabel: 'Consultar por WhatsApp' };
export const consultationBanner: BannerConfig = { ...action, id: 'diego-horizontal', format: 'horizontal', layout: 'artwork', media: horizontalMedia, theme };
export const mobileConsultationBanner: BannerConfig = { ...consultationBanner, id: 'diego-mobile-horizontal', media: mobileMedia };
export const serviceBanners: BannerConfig[] = [
  { id: 'diego-documents', format: 'square', layout: 'overlay', title: 'Revisa tus documentos', accentTitle: 'Antes de firmar', ctaLabel: 'Consultar', href: secondOpinionHref, target: '_blank', footnote: campaignStatus, media: { src: '/images/advertising/diego-home-photo.png', alt: 'Vivienda para una gestión inmobiliaria', width: 1448, height: 1086 }, theme },
  { id: 'diego-property', format: 'square', layout: 'overlay', title: 'Casa o terreno', accentTitle: 'Conoce tus opciones', ctaLabel: 'Escribir', href: prosthesisHref, target: '_blank', footnote: campaignStatus, media: { src: '/images/advertising/diego-land-photo.png', alt: 'Vivienda y terreno', width: 1448, height: 1086 }, theme },
];
export const prosthesisBrandReferences: { name: string; href: string }[] = [];
export const popupPromotion: PromotionConfig = { ...action, id: 'diego-popup', media: { src: '/images/advertising/diego-popup.png', alt: 'Diego Ochoa: hablemos de tu próximo inmueble. Compra, terreno y crédito.', ...adArtwork.popup } };
export const leftRailPromotion: PromotionConfig = { ...action, id: 'diego-left', media: verticalMedia };
export const railPromotion: PromotionConfig = { ...action, id: 'diego-right', media: { ...verticalMedia, src: '/images/advertising/diego-documents-vertical.png', alt: 'Diego Ochoa: antes de firmar, revisa los documentos de tu compraventa.' } };
export const mobileRailPromotion: PromotionConfig = { ...action, id: 'diego-mobile', media: mobileMedia };
