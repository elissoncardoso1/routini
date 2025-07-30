import { useState, useEffect, useMemo, useCallback } from 'react';
import { Atendimento, Profissional, Paciente } from '../types';
import { db } from '../db';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProximosAtendimentosProps {
  limit?: number;
  showDate?: boolean;
}

export function ProximosAtendimentos({ limit = 5, showDate = true }: ProximosAtendimentosProps) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoizar a função de carregamento
  const loadData = useCallback(async () => {
    try {
      const [atendimentosDB, profissionaisDB, pacientesDB] = await Promise.all([
        db.atendimentos.toArray(),
        db.profissionais.toArray(),
        db.pacientes.toArray()
      ]);

      setAtendimentos(atendimentosDB);
      setProfissionais(profissionaisDB);
      setPacientes(pacientesDB);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoizar os próximos atendimentos filtrados e ordenados
  const proximosAtendimentos = useMemo(() => {
    const agora = new Date();
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

    return atendimentos
      .filter(atendimento => {
        const dataAtendimento = new Date(atendimento.inicio);
        return dataAtendimento >= hoje && !atendimento.cancelado;
      })
      .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())
      .slice(0, limit);
  }, [atendimentos, limit]);

  // Memoizar a função de busca de profissional
  const getProfissional = useCallback((id: string) => {
    return profissionais.find(p => p.id === id);
  }, [profissionais]);

  // Memoizar a função de busca de paciente
  const getPaciente = useCallback((id: string) => {
    return pacientes.find(p => p.id === id);
  }, [pacientes]);

  // Memoizar a função de formatação de data
  const formatDate = useCallback((date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Próximos Atendimentos</h3>
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (proximosAtendimentos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Próximos Atendimentos</h3>
        <p className="text-gray-500 text-sm">Nenhum atendimento agendado para hoje.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Próximos Atendimentos</h3>
      <div className="space-y-3">
        {proximosAtendimentos.map((atendimento) => {
          const profissional = getProfissional(atendimento.profissionalId);
          const paciente = getPaciente(atendimento.pacienteId || '');

          if (!profissional || !paciente) return null;

          return (
            <div key={atendimento.id} className="border-l-4 border-primary-500 pl-3 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{paciente.nome}</p>
                  <p className="text-sm text-gray-600">{profissional.nome}</p>
                  {showDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(atendimento.inicio)}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {format(atendimento.inicio, 'HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 