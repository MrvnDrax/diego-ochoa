export type LocationId = 'tabasco' | 'chiapas' | 'veracruz';
export type GoogleMapsUrl = `https://www.google.com/maps?${string}`;
export type GoogleMapsEmbedUrl = `https://www.google.com/maps?${string}`;
export interface ScheduleSlot { days: string; hours: string; }
export interface PostalAddress { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: 'MX'; }
export interface ClinicLocation { id: LocationId; area: string; facilityName: string; displayName: string; office?: string; address: string; addressDisplay: string; postalAddress: PostalAddress; mapUrl: GoogleMapsUrl; mapEmbedUrl: GoogleMapsEmbedUrl; schedule: ScheduleSlot[]; }
const map = (region: string) => {
  const query = encodeURIComponent(region + ', México');
  return {
    mapUrl: `https://www.google.com/maps?q=${query}` as GoogleMapsUrl,
    mapEmbedUrl: `https://www.google.com/maps?q=${query}&output=embed` as GoogleMapsEmbedUrl,
  };
};
const address = (region: string, city = ''): PostalAddress => ({
  streetAddress: '', addressLocality: city, addressRegion: region, postalCode: '', addressCountry: 'MX',
});
export const locations = [
  { id: 'tabasco', area: 'Tabasco', facilityName: 'Base en Villahermosa', displayName: 'Gestiones en Tabasco', address: 'Tabasco, México', addressDisplay: 'Atención desde Villahermosa. Confirma la modalidad y el punto de encuentro según tu gestión.', postalAddress: address('Tabasco', 'Villahermosa'), ...map('Tabasco'), schedule: [] },
  { id: 'chiapas', area: 'Chiapas', facilityName: 'Cobertura por confirmar', displayName: 'Gestiones en Chiapas', address: 'Chiapas, México', addressDisplay: 'Cuéntanos tu trámite para confirmar cómo podemos atenderlo en Chiapas.', postalAddress: address('Chiapas'), ...map('Chiapas'), schedule: [] },
  { id: 'veracruz', area: 'Veracruz', facilityName: 'Cobertura por confirmar', displayName: 'Gestiones en Veracruz', address: 'Veracruz, México', addressDisplay: 'Cuéntanos tu trámite para confirmar cómo podemos atenderlo en Veracruz.', postalAddress: address('Veracruz'), ...map('Veracruz'), schedule: [] },
] satisfies ClinicLocation[];
export const primaryLocationId: LocationId = 'tabasco';
