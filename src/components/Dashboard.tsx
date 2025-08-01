import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profissional, Paciente, Atendimento } from '../types';
import { db } from '../db';
import { MiniCalendar } from './MiniCalendar';
import { ProximosAtendimentos } from './ProximosAtendimentos';
import { AgendamentoForm } from './AgendamentoForm';
import { Dialog } from '@headlessui/react';
import { ProfissionalForm } from './ProfissionalForm';
import { PacienteForm } from './PacienteForm';
import { 
  LoadingSpinner, 
  CardSkeleton, 
  ListSkeleton,
  LoadingOverlay 
} from './LoadingStates';
import { 
  useNotifications, 
  ToastContainer
} from './FeedbackVisual';

export function Dashboard() {
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } = useNotifications();
  
  // Estados para dados
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  
  // Estados de loading
  const [loading, setLoading] = useState(true);
  
  // Estados para modais
  const [showProfissionalForm, setShowProfissionalForm] = useState(false);
  const [showPacienteForm, setShowPacienteForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | undefined>(undefined);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | undefined>(undefined);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      await Promise.all([
        db.profissionais.toArray().then(data => {
          setProfissionais(data);
        }),
        db.pacientes.toArray().then(data => {
          setPacientes(data);
        }),
        db.atendimentos.toArray().then(data => {
          setAtendimentos(data);
        })
      ]);

      addNotification({
        type: 'success',
        title: 'Dados carregados',
        message: 'Dashboard atualizado com sucesso',
        duration: 3000
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao carregar dados',
        message: 'Não foi possível carregar os dados do dashboard',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDate = () => {
    navigate('/');
  };

  const handleSaveAppointment = () => {
    loadData();
    setModalOpen(false);
    addNotification({
      type: 'success',
      title: 'Atendimento salvo',
      message: 'O agendamento foi salvo com sucesso',
      duration: 3000
    });
  };



  const handleEditarProfissional = (profissional: Profissional) => {
    setProfissionalSelecionado(profissional);
    setShowProfissionalForm(true);
  };

  const handleExcluirProfissional = async (id: string) => {
    try {
      await db.profissionais.delete(id);
      setProfissionais(profissionais.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        title: 'Profissional excluído',
        message: 'O profissional foi removido com sucesso',
        duration: 3000
      });
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o profissional',
        duration: 5000
      });
    }
  };

  const handleEditarPaciente = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setShowPacienteForm(true);
  };

  const handleExcluirPaciente = async (id: string) => {
    try {
      await db.pacientes.delete(id);
      setPacientes(pacientes.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        title: 'Paciente excluído',
        message: 'O paciente foi removido com sucesso',
        duration: 3000
      });
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o paciente',
        duration: 5000
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Próximos Atendimentos</h2>
            <ListSkeleton items={3} />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Mini Calendário</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <LoadingSpinner size="md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Container */}
      <ToastContainer 
        notifications={notifications} 
        onClose={removeNotification}
        position="top-right"
      />

      {/* Loading Overlay para operações */}
      <LoadingOverlay 
        isVisible={false}
        text="Processando..."
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profissionais</p>
              <p className="text-2xl font-semibold text-gray-900">{profissionais.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pacientes</p>
              <p className="text-2xl font-semibold text-gray-900">{pacientes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Atendimentos</p>
              <p className="text-2xl font-semibold text-gray-900">{atendimentos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">
                {atendimentos.filter(a => {
                  const hoje = new Date();
                  const dataAtendimento = new Date(a.inicio);
                  return dataAtendimento.toDateString() === hoje.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Atendimentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Próximos Atendimentos</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm bg-primary-500 text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors"
            >
              Novo
            </button>
          </div>
          <ProximosAtendimentos
            limit={5}
            showDate={true}
          />
        </div>

        {/* Mini Calendário */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Mini Calendário</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <MiniCalendar
              onSelectDate={handleSelectDate}
            />
          </div>
        </div>
      </div>

      {/* Seção de Gerenciamento */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profissionais */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profissionais</h3>
            <button
              onClick={() => setShowProfissionalForm(true)}
              className="text-sm bg-primary-500 text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors"
            >
              Adicionar
            </button>
          </div>
          
          {loading ? (
            <ListSkeleton items={3} />
          ) : (
            <div className="space-y-3">
              {profissionais.slice(0, 3).map(profissional => (
                <div key={profissional.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: profissional.cor }}
                    >
                      {profissional.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profissional.nome}</p>
                      <p className="text-sm text-gray-500">{profissional.funcao}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditarProfissional(profissional)}
                      className="text-primary-500 hover:text-primary-600 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirProfissional(profissional.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              {profissionais.length > 3 && (
                <button className="text-primary-500 hover:text-primary-600 text-sm">
                  Ver todos ({profissionais.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pacientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pacientes</h3>
            <button
              onClick={() => setShowPacienteForm(true)}
              className="text-sm bg-primary-500 text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors"
            >
              Adicionar
            </button>
          </div>
          
          {loading ? (
            <ListSkeleton items={3} />
          ) : (
            <div className="space-y-3">
              {pacientes.slice(0, 3).map(paciente => (
                <div key={paciente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {paciente.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{paciente.nome}</p>
                      <p className="text-sm text-gray-500">{paciente.responsavel.nome}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditarPaciente(paciente)}
                      className="text-primary-500 hover:text-primary-600 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirPaciente(paciente.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              {pacientes.length > 3 && (
                <button className="text-primary-500 hover:text-primary-600 text-sm">
                  Ver todos ({pacientes.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {showProfissionalForm && (
        <ProfissionalForm
          profissional={profissionalSelecionado}
          isOpen={showProfissionalForm}
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
      )}

      {showPacienteForm && (
        <PacienteForm
          paciente={pacienteSelecionado}
          isOpen={showPacienteForm}
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