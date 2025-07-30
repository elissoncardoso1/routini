import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../db';
import { Atendimento, Paciente } from '../types';
import { Logo } from './Logo';

export function Sidebar() {
  const navigate = useNavigate();
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const fimMes = endOfMonth(hoje);
  const diasDoMes = eachDayOfInterval({ start: inicioMes, end: fimMes });
  const diaDaSemana = inicioMes.getDay();

  // Estados para dados reais
  const [eventosHoje, setEventosHoje] = useState<Atendimento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const hoje = new Date();
      const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0, 0);
      const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
      const [atendimentos, pacientesDB] = await Promise.all([
        db.atendimentos.toArray(),
        db.pacientes.toArray()
      ]);
      const doDia = atendimentos.filter(a =>
        a.inicio >= inicioDia && a.inicio <= fimDia && !a.cancelado
      );
      setEventosHoje(doDia);
      setPacientes(pacientesDB);
    };
    carregarDados();
  }, []);

  const getPacienteNome = (id: string) => pacientes.find(p => p.id === id)?.nome || '';

  const irParaAgenda = () => {
    navigate('/');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo e descrição */}
      <div className="mb-8">
        <Link to="/" className="block">
          <Logo size="lg" className="mb-2" />
          <p className="text-xs text-gray-400">Gerencie escalas com eficiência</p>
        </Link>
      </div>

      {/* Menu principal */}
      <nav className="mb-6">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors">
              <span className="text-lg">📅</span>
              <span>Agenda</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors">
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/cadastro" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors">
              <span className="text-lg">📝</span>
              <span>Cadastros</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mini calendário */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {format(hoje, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => (
            <div key={d} className="text-gray-400 text-xs font-medium">
              {d}
            </div>
          ))}
          {Array.from({ length: diaDaSemana }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {diasDoMes.map((dia, i) => (
            <div
              key={i}
              onClick={() => irParaAgenda()}
              className={`p-1.5 text-sm rounded-full cursor-pointer transition-colors
                ${dia.getDate() === hoje.getDate()
                  ? 'bg-primary-500 text-white font-bold'
                  : 'hover:bg-gray-700'
                }`}
            >
              {dia.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Eventos de hoje reais */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Hoje</h3>
        <div className="space-y-3">
          {eventosHoje.length === 0 && (
            <span className="text-gray-400 text-sm">Nenhum atendimento hoje.</span>
          )}
          {eventosHoje.map((atendimento) => (
            <div key={atendimento.id} className="group cursor-pointer" onClick={() => navigate('/')}> 
              <div className="flex items-center gap-2">
                <span className="text-primary-300">
                  {atendimento.inicio instanceof Date
                    ? atendimento.inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date(atendimento.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                </span>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {atendimento.tipo} {getPacienteNome(atendimento.pacienteId || '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campo de busca */}
      <div className="mt-auto pt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar atendimentos..."
            className="w-full p-2 pl-8 rounded bg-gray-800 text-sm placeholder-gray-400 text-white border border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
    </div>
  );
} 