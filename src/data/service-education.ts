export interface ServiceEducation { title: string; intro: string; points: string[]; }
const keys = ['fracturas','infiltracion','lesiones-deportivas','artroscopia','protesis','cirugia-columna'];
const general: Record<number, ServiceEducation> = {
  0: { title: 'Información que conviene reunir', intro: 'Una conversación inicial es más útil cuando conoces el objetivo y los documentos disponibles.', points: ['Qué operación o trámite buscas realizar.', 'Dónde está el inmueble y qué sabes de su situación.', 'Qué documentos tienes y qué dudas te preocupan.'] },
  3: { title: 'Seguimiento del proceso', intro: 'Los pasos y tiempos dependen de las instituciones y de cada expediente.', points: ['Mantener una lista de requisitos pendientes.', 'Confirmar las respuestas en canales oficiales.', 'Revisar el documento final antes de dar el trámite por terminado.'] },
};
const serviceEducation: Record<string, Record<number, ServiceEducation>> = Object.fromEntries(keys.map(key => [key, general]));
export function getServiceEducation(key: string, index: number): ServiceEducation | undefined { return serviceEducation[key]?.[index]; }
