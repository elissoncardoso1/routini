import { Paciente as PacienteType } from './paciente';

export type Profissional = {
  id: string;
  nome: string;
  funcao: Funcao;
  disponibilidade: Disponibilidade[];
  cor: string;
};

export type Funcao = 
  | 'Analista do Comportamento'
  | 'AT'
  | 'Supervisor Clínico'
  | 'Psicólogo Clínico'
  | 'Terapeuta Ocupacional'
  | 'Fonoaudiólogo'
  | 'Educador Físico'
  | 'Musicoterapeuta'
  | 'Pedagogo'
  | 'Nutricionista'
  | 'Médico'
  | 'Coordenador Clínico'
  | 'Recepcionista'
  | 'Estagiário';

export const CORES_FUNCAO: Record<Funcao, string> = {
  'Analista do Comportamento': '#8925F2',
  'AT': '#6F1CC7',
  'Supervisor Clínico': '#D9B6FF',
  'Psicólogo Clínico': '#7c3aed',
  'Terapeuta Ocupacional': '#5b21b6',
  'Fonoaudiólogo': '#4c1d95',
  'Educador Físico': '#3b82f6',
  'Musicoterapeuta': '#8b5cf6',
  'Pedagogo': '#a78bfa',
  'Nutricionista': '#c4b5fd',
  'Médico': '#ddd6fe',
  'Coordenador Clínico': '#ede9fe',
  'Recepcionista': '#f5f3ff',
  'Estagiário': '#f3e8ff'
};

export type Disponibilidade = {
  dia: number; // 0-6 (Domingo-Sábado)
  turno: 'manhã' | 'tarde' | 'noite';
};

export type StatusAtendimento = 'agendado' | 'realizado' | 'cancelado' | 'remarcado';

export type Atendimento = {
  id: string;
  profissionalId: string;
  pacienteId?: string;
  tipo: Funcao;
  inicio: Date;
  fim: Date;
  observacoes?: string;
  status?: StatusAtendimento;
  cancelado?: boolean;
  motivoCancelamento?: string;
  dataCancelamento?: Date;
  recorrenciaId?: string; // Identificador para agrupar atendimentos recorrentes
};

export type Paciente = PacienteType;

export interface Feriado {
  date: string;
  name: string;
  type: string;
} 