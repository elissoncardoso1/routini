import { useState, useEffect } from 'react';
import { format, isFuture, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Atendimento, Profissional, Paciente } from '../types';

interface ProximosAtendimentosProps {
  max?: number;
  onViewAppointment?: (atendimento: Atendimento) => void;
  atendimentos: Atendimento[];
  profissionais: Profissional[];
  pacientes: Paciente[];
  selectedDate: Date;
}

export function ProximosAtendimentos({ 
  max = 5, 
  onViewAppointment,
  atendimentos: atendimentosProps,
  profissionais,
  pacientes,
  selectedDate
}: ProximosAtendimentosProps) {
  const [atendimentosFiltrados, setAtendimentosFiltrados] = useState<Array<Atendimento & { 
    profissional?: Profissional, 
    paciente?: Paciente 
  }>>([]);
  const [loading, setLoading] = useState(true);

  // Processar atendimentos quando as props mudarem
  useEffect(() => {
    setLoading(true);
    try {
      // Filtrar apenas atendimentos atuais e futuros, e não cancelados
      const filtrados = atendimentosProps
        .filter(a => (isToday(a.inicio) || isFuture(a.inicio)) && !a.cancelado)
        .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())
        .slice(0, max)
        .map(atendimento => {
          // Adicionar objetos de profissional e paciente
          const profissional = profissionais.find(p => p.id === atendimento.profissionalId);
          const paciente = pacientes.find(p => p.id === atendimento.pacienteId);
          return {
            ...atendimento,
            profissional,
            paciente
          };
        });
      
      setAtendimentosFiltrados(filtrados);
    } catch (error) {
      console.error('Erro ao processar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  }, [atendimentosProps, profissionais, pacientes, max, selectedDate]);
  
  // Formatar uma data para exibição
  const formatarData = (data: Date) => {
    if (isToday(data)) {
      return `Hoje às ${format(data, 'HH:mm')}`;
    }
    
    return format(data, "dd/MM 'às' HH:mm", { locale: ptBR });
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Próximos Atendimentos</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (atendimentosFiltrados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Próximos Atendimentos</h2>
        <p className="text-gray-500 text-center py-6">
          Não há atendimentos agendados para hoje ou os próximos dias.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Próximos Atendimentos</h2>
      <div className="space-y-4">
        {atendimentosFiltrados.map(atendimento => {
          const profissionalNome = atendimento.profissional?.nome || 'Profissional não encontrado';
          const pacienteNome = atendimento.paciente?.nome || 'Paciente não encontrado';
          
          return (
            <div 
              key={atendimento.id}
              onClick={() => onViewAppointment && onViewAppointment(atendimento)}
              className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-blue-500`}>
                {pacienteNome.substring(0, 1)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{pacienteNome}</h3>
                <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                  <span>{formatarData(atendimento.inicio)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{profissionalNome}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {atendimento.tipo.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 