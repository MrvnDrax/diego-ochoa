export type CredentialId = 'approach' | 'documents' | 'followup';
export interface Credential { id: CredentialId; label: string; value: string; }
export const credentials = [
  { id: 'approach', label: 'Enfoque', value: 'Bienes raíces' },
  { id: 'documents', label: 'Proceso', value: 'Revisión documental' },
  { id: 'followup', label: 'Atención', value: 'Villahermosa, Tabasco' },
] satisfies Credential[];
