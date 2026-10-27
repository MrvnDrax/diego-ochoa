import type { ImageMetadata } from 'astro';
import presentation from '@assets/diego/diego-ochoa-presentation.png';
import consultation from '@assets/diego/property-consultation.png';
import land from '@assets/diego/property-and-land.png';
import home from '@assets/diego/home-interior.png';
export interface ServiceImage { image: ImageMetadata; alt: string; }
export interface ServiceVisual { card: ServiceImage; hero: ServiceImage; sections: Array<ServiceImage | null>; }
const photos = [consultation, home, land, presentation, home, consultation];
const alts = ['Conversación sobre documentos de una propiedad', 'Interior de vivienda', 'Vivienda y terreno', 'Retrato de Diego Ochoa', 'Interior de vivienda', 'Asesoría inmobiliaria'];
const keys = ['fracturas','infiltracion','lesiones-deportivas','artroscopia','protesis','cirugia-columna'];
const serviceVisuals: Record<string, ServiceVisual> = Object.fromEntries(keys.map((key, i) => [key, {
  card: { image: photos[i], alt: alts[i] },
  hero: { image: photos[i], alt: alts[i] },
  sections: [null, { image: i % 2 ? consultation : home, alt: i % 2 ? alts[0] : alts[1] }, { image: i % 2 ? land : consultation, alt: i % 2 ? alts[2] : alts[0] }, null],
}]));
export function getServiceVisual(key: string, _imageAlt?: string): ServiceVisual { return serviceVisuals[key] ?? serviceVisuals.fracturas; }
