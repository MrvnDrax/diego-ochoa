export const insurers = [
  { id: 'objetivo', label: 'Cuéntanos tu objetivo', icon: 'message-circle' },
  { id: 'documentos', label: 'Revisamos documentos', icon: 'file-text' },
  { id: 'requisitos', label: 'Ubicamos requisitos', icon: 'check' },
  { id: 'opciones', label: 'Aclaramos opciones', icon: 'route' },
  { id: 'pasos', label: 'Definimos los pasos', icon: 'map-pin' },
  { id: 'seguimiento', label: 'Damos seguimiento', icon: 'clock' },
] as const;
export type InsurerId = (typeof insurers)[number]['id'];
