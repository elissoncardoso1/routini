import { useState, useEffect, useRef } from 'react';
import { Profissional, Paciente, Atendimento } from '../types';
import { db } from '../db';
import { CountUp } from 'countup.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProfissionalForm } from './ProfissionalForm';
import { PacienteForm } from './PacienteForm';
import { MiniCalendar } from './MiniCalendar';
import { ProximosAtendimentos } from './ProximosAtendimentos';
import { AgendamentoForm } from './AgendamentoForm';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfissionalForm, setShowProfissionalForm] = useState(false);
  const [showPacienteForm, setShowPacienteForm] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | undefined>();
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'profissionais' | 'pacientes'>('overview');
  const pacientesRef = useRef<HTMLParagraphElement>(null);
  const profissionaisRef = useRef<HTMLParagraphElement>(null);
  const atendimentosRef = useRef<HTMLParagraphElement>(null);
  
  // Estado para o modal de atendimento
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const pacientesCountUp = new CountUp(pacientesRef.current!, pacientes.length);
      const profissionaisCountUp = new CountUp(profissionaisRef.current!, profissionais.length);
      const atendimentosMes = atendimentos.filter(a => {
        const hoje = new Date();
        return a.inicio.getMonth() === hoje.getMonth() && a.inicio.getFullYear() === hoje.getFullYear();
      }).length;
      const atendimentosCountUp = new CountUp(atendimentosRef.current!, atendimentosMes);

      pacientesCountUp.start();
      profissionaisCountUp.start();
      atendimentosCountUp.start();
    }
  }, [loading, pacientes.length, profissionais.length, atendimentos]);

  const loadData = async () => {
    setLoading(true);
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
  };

  // Função para navegar para a agenda em uma data específica
  const handleSelectDate = (date: Date) => {
    navigate('/', { state: { selectedDate: date.toISOString() } });
  };
  
  // Função para abrir o modal de atendimento
  const handleViewAppointment = (atendimento: Atendimento) => {
    setSelectedAtendimento(atendimento);
    setSelectedDate(atendimento.inicio);
    setModalOpen(true);
  };
  
  // Função para quando um atendimento é salvo no modal
  const handleSaveAppointment = () => {
    loadData(); // Recarregar os dados
    setModalOpen(false);
    setSelectedAtendimento(null);
  };

  const getAtendimentosPorProfissional = () => {
    const data = profissionais.map(prof => {
      const atendimentosDoProf = atendimentos.filter(a => a.profissionalId === prof.id);
      return {
        nome: prof.nome,
        quantidade: atendimentosDoProf.length
      };
    });
    return data;
  };

  const getUltimosAtendimentos = () => {
    return atendimentos
      .sort((a, b) => b.inicio.getTime() - a.inicio.getTime())
      .slice(0, 5)
      .map(atendimento => {
        const profissional = profissionais.find(p => p.id === atendimento.profissionalId);
        const paciente = pacientes.find(p => p.id === atendimento.pacienteId);
        return {
          ...atendimento,
          profissionalNome: profissional?.nome || 'Não encontrado',
          pacienteNome: paciente?.nome || 'Não encontrado'
        };
      });
  };

  const handleEditarProfissional = (profissional: Profissional) => {
    setProfissionalSelecionado(profissional);
    setShowProfissionalForm(true);
  };

  const handleExcluirProfissional = async (id: string) => {
    // Verificar se o profissional tem atendimentos
    const atendimentosDoProfissional = atendimentos.filter(a => a.profissionalId === id);
    
    if (atendimentosDoProfissional.length > 0) {
      if (!window.confirm(`Este profissional possui ${atendimentosDoProfissional.length} atendimentos registrados. Excluir mesmo assim?`)) {
        return;
      }
      // Excluir os atendimentos relacionados
      for (const atendimento of atendimentosDoProfissional) {
        await db.atendimentos.delete(atendimento.id);
      }
    } else {
      if (!window.confirm('Tem certeza que deseja excluir este profissional?')) {
        return;
      }
    }
    
    await db.profissionais.delete(id);
    loadData();
  };

  const handleEditarPaciente = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setShowPacienteForm(true);
  };

  const handleExcluirPaciente = async (id: string) => {
    // Verificar se o paciente tem atendimentos
    const atendimentosDoPaciente = atendimentos.filter(a => a.pacienteId === id);
    
    if (atendimentosDoPaciente.length > 0) {
      if (!window.confirm(`Este paciente possui ${atendimentosDoPaciente.length} atendimentos registrados. Excluir mesmo assim?`)) {
        return;
      }
      // Excluir os atendimentos relacionados
      for (const atendimento of atendimentosDoPaciente) {
        await db.atendimentos.delete(atendimento.id);
      }
    } else {
      if (!window.confirm('Tem certeza que deseja excluir este paciente?')) {
        return;
      }
    }
    
    await db.pacientes.delete(id);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => {
              setProfissionalSelecionado(undefined);
              setShowProfissionalForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Novo Profissional
          </button>
          <button
            onClick={() => {
              setPacienteSelecionado(undefined);
              setShowPacienteForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('profissionais')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'profissionais'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profissionais
          </button>
          <button
            onClick={() => setActiveTab('pacientes')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'pacientes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pacientes
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total de Pacientes</h3>
              <p ref={pacientesRef} className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total de Profissionais</h3>
              <p ref={profissionaisRef} className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Atendimentos do Mês</h3>
              <p ref={atendimentosRef} className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Atendimentos por Profissional</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getAtendimentosPorProfissional()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Nova seção para calendário e próximos atendimentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Calendário</h2>
              <MiniCalendar
                onSelectDate={handleSelectDate}
                selectedDate={selectedDate}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Próximos Atendimentos</h2>
              <ProximosAtendimentos
                atendimentos={atendimentos}
                profissionais={profissionais}
                pacientes={pacientes}
                selectedDate={selectedDate}
                onViewAppointment={handleViewAppointment}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Últimos Atendimentos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getUltimosAtendimentos().map(atendimento => (
                    <tr key={atendimento.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.inicio.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.profissionalNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.pacienteNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {atendimento.tipo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'profissionais' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Lista de Profissionais</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilidade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profissionais.map(profissional => (
                  <tr key={profissional.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {profissional.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profissional.funcao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profissional.disponibilidade.map(d => (
                        <span key={`${d.dia}-${d.turno}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {d.dia === 1 ? 'Seg' : d.dia === 2 ? 'Ter' : d.dia === 3 ? 'Qua' : d.dia === 4 ? 'Qui' : d.dia === 5 ? 'Sex' : d.dia === 6 ? 'Sáb' : 'Dom'} - {d.turno}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditarProfissional(profissional)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluirProfissional(profissional.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pacientes' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Lista de Pacientes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Nascimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pacientes.map(paciente => (
                  <tr key={paciente.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paciente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.dataNascimento.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.responsavel.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.diagnostico || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditarPaciente(paciente)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluirPaciente(paciente.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showProfissionalForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => {
                  setShowProfissionalForm(false);
                  setProfissionalSelecionado(undefined);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProfissionalForm
              profissional={profissionalSelecionado}
              onSave={() => {
                setShowProfissionalForm(false);
                setProfissionalSelecionado(undefined);
                loadData();
              }}
              onCancel={() => {
                setShowProfissionalForm(false);
                setProfissionalSelecionado(undefined);
              }}
            />
          </div>
        </div>
      )}

      {showPacienteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => {
                  setShowPacienteForm(false);
                  setPacienteSelecionado(undefined);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PacienteForm
              paciente={pacienteSelecionado}
              onSave={() => {
                setShowPacienteForm(false);
                setPacienteSelecionado(undefined);
                loadData();
              }}
              onCancel={() => {
                setShowPacienteForm(false);
                setPacienteSelecionado(undefined);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Modal de visualização de atendimento */}
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAtendimento(null);
        }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                {selectedAtendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
              </Dialog.Title>
              
              <AgendamentoForm
                atendimento={selectedAtendimento || undefined}
                onSave={handleSaveAppointment}
                onCancel={() => {
                  setModalOpen(false);
                  setSelectedAtendimento(null);
                }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 