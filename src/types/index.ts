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
  'Analista do Comportamento': '#1F77B4',
  'AT': '#FF7F0E',
  'Supervisor Clínico': '#2CA02C',
  'Psicólogo Clínico': '#9467BD',
  'Terapeuta Ocupacional': '#8C564B',
  'Fonoaudiólogo': '#17BECF',
  'Educador Físico': '#D62728',
  'Musicoterapeuta': '#E377C2',
  'Pedagogo': '#BCBD22',
  'Nutricionista': '#98DF8A',
  'Médico': '#7F7F7F',
  'Coordenador Clínico': '#1A1A1A',
  'Recepcionista': '#AEC7E8',
  'Estagiário': '#C5B0D5'
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