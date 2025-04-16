import { useState, useEffect } from 'react';
import { Atendimento, Profissional, Paciente, Funcao } from '../types';
import { db } from '../db';
import { CORES_FUNCAO } from '../constants/calendar';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  profissionalId: string;
  pacienteId: string;
  tipo: Funcao;
  observacoes: string;
  extendedProps: {
    tooltip: string;
    icon: string;
    profissional: string;
  };
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedProfissionais, loadedPacientes, loadedAtendimentos] = await Promise.all([
        db.profissionais.toArray(),
        db.pacientes.toArray(),
        db.atendimentos.toArray()
      ]);

      setProfissionais(loadedProfissionais);
      setPacientes(loadedPacientes);

      const eventosCalendario = await Promise.all(
        loadedAtendimentos
          .filter(atendimento => !atendimento.cancelado)
          .map(async (atendimento) => {
            const profissional = loadedProfissionais.find(p => p.id === atendimento.profissionalId);
            const paciente = loadedPacientes.find(p => p.id === atendimento.pacienteId);
            
            if (!profissional || !paciente) return null;

            const cores = CORES_FUNCAO[profissional.funcao];
            
            return {
              id: atendimento.id,
              title: `${paciente.nome} - ${profissional.nome}`,
              start: atendimento.inicio.toISOString(),
              end: atendimento.fim.toISOString(),
              backgroundColor: cores.bg,
              borderColor: cores.border,
              textColor: cores.text,
              profissionalId: profissional.id,
              pacienteId: paciente.id,
              tipo: profissional.funcao,
              observacoes: atendimento.observacoes || '',
              extendedProps: {
                tooltip: `${cores.icon} ${paciente.nome}<br><span class="text-gray-500">${profissional.nome}</span>`,
                icon: cores.icon,
                profissional: profissional.nome
              }
            } as CalendarEvent;
          })
      );

      setEvents(eventosCalendario.filter((evento): evento is CalendarEvent => evento !== null));
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro ao carregar dados'));
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const findEventById = (id: string) => {
    return events.find(e => e.id === id);
  };

  const convertEventToAtendimento = (event: CalendarEvent): Atendimento => {
    return {
      id: event.id,
      profissionalId: event.profissionalId,
      pacienteId: event.pacienteId,
      tipo: event.tipo,
      inicio: new Date(event.start),
      fim: new Date(event.end),
      observacoes: event.observacoes
    };
  };

  return {
    events,
    profissionais,
    pacientes,
    loading,
    error,
    loadData,
    findEventById,
    convertEventToAtendimento
  };
} 