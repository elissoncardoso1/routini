import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendarEvents } from '../hooks/useCalendarEvents';

interface MiniCalendarProps {
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date;
}

export function MiniCalendar({ onSelectDate, selectedDate: propSelectedDate }: MiniCalendarProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(propSelectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(propSelectedDate || new Date()));
  
  const { events } = useCalendarEvents();
  
  // Obter dias do mês
  const inicioMes = startOfMonth(currentMonth);
  const fimMes = endOfMonth(currentMonth);
  const diasDoMes = eachDayOfInterval({ start: inicioMes, end: fimMes });
  const diaDaSemana = inicioMes.getDay();

  // Array com os dias da semana completos para usar como chaves únicas
  const diasDaSemana = [
    { short: 'D', full: 'Domingo' },
    { short: 'S', full: 'Segunda' },
    { short: 'T', full: 'Terça' },
    { short: 'Q', full: 'Quarta' },
    { short: 'Q', full: 'Quinta' },
    { short: 'S', full: 'Sexta' },
    { short: 'S', full: 'Sábado' }
  ];
  
  // Verificar se um dia tem atendimentos
  const temAtendimento = (dia: Date) => {
    return events.some(event => {
      const dataEvento = new Date(event.start);
      return isSameDay(dataEvento, dia);
    });
  };
  
  // Selecionar um dia
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
    navigate('/', { state: { selectedDate: date.toISOString() } });
  };

  // Navegar entre meses
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePreviousMonth}
          className="text-gray-600 hover:text-gray-800"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-800"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {diasDaSemana.map((dia) => (
          <div key={dia.full} className="text-gray-400 text-xs font-medium">
            {dia.short}
          </div>
        ))}
        {Array.from({ length: diaDaSemana }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {diasDoMes.map((dia) => {
          const dataAtual = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Number(dia));
          const isHoje = isSameDay(dataAtual, new Date());
          const isSelecionado = isSameDay(dataAtual, selectedDate);
          const temAtendimentos = temAtendimento(dataAtual);
          
          return (
            <button
              key={`dia-${dia}`}
              onClick={() => handleSelectDate(dataAtual)}
              className={`
                w-8 h-8 rounded-full text-sm flex items-center justify-center
                ${isHoje ? 'bg-blue-100 text-blue-600' : ''}
                ${isSelecionado ? 'bg-blue-500 text-white' : ''}
                ${temAtendimentos ? 'font-bold' : ''}
                hover:bg-gray-100
              `}
            >
              {Number(dia)}
            </button>
          );
        })}
      </div>
    </div>
  );
} 