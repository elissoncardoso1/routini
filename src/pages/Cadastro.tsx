import { useState, useEffect } from 'react';
import { ProfissionalForm } from '../components/ProfissionalForm';
import { PacienteForm } from '../components/PacienteForm';
import { BackupManager } from '../components/BackupManager';
import { db } from '../db';

export function Cadastro() {
  const [showProfissionalForm, setShowProfissionalForm] = useState(false);
  const [showPacienteForm, setShowPacienteForm] = useState(false);
  const [totalProfissionais, setTotalProfissionais] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);

  // Carregar contagem inicial
  useEffect(() => {
    const loadCounts = async () => {
      const profCount = await db.profissionais.count();
      const pacCount = await db.pacientes.count();
      setTotalProfissionais(profCount);
      setTotalPacientes(pacCount);
    };
    loadCounts();
  }, []);

  const handleVerProfissionais = () => {
    window.location.href = '/dashboard';
  };

  const handleVerPacientes = () => {
    window.location.href = '/dashboard';
  };

  const handleAposGravar = () => {
    setShowProfissionalForm(false);
    setShowPacienteForm(false);
    // Atualizar contagens
    const loadCounts = async () => {
      const profCount = await db.profissionais.count();
      const pacCount = await db.pacientes.count();
      setTotalProfissionais(profCount);
      setTotalPacientes(pacCount);
    };
    loadCounts();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastros</h1>
        <div className="space-x-2">
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => setShowProfissionalForm(true)}
          >
            Novo Cadastro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Card de Profissionais */}
        <div className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profissionais</h2>
            <span className="text-sm text-gray-500">{totalProfissionais} cadastros</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Gerencie os profissionais, suas funções e disponibilidades.
          </p>
          <div className="flex justify-between">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={handleVerProfissionais}
            >
              Ver todos →
            </button>
            <button 
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              onClick={() => setShowProfissionalForm(true)}
            >
              Novo
            </button>
          </div>
        </div>

        {/* Card de Pacientes */}
        <div className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pacientes</h2>
            <span className="text-sm text-gray-500">{totalPacientes} cadastros</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Gerencie os pacientes, seus responsáveis e histórico.
          </p>
          <div className="flex justify-between">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={handleVerPacientes}
            >
              Ver todos →
            </button>
            <button 
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              onClick={() => setShowPacienteForm(true)}
            >
              Novo
            </button>
          </div>
        </div>

        {/* Card de Configurações */}
        <div className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Configurações</h2>
            <span className="text-sm text-gray-500">Sistema</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure horários, tipos de atendimento e outras opções.
          </p>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Configurar →
          </button>
        </div>
      </div>
      
      {/* Componente de Backup/Restore */}
      <div className="mt-8">
        <BackupManager />
      </div>

      {/* Modal de Cadastro de Profissional */}
      {showProfissionalForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setShowProfissionalForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProfissionalForm
              onSave={handleAposGravar}
              onCancel={() => setShowProfissionalForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Paciente */}
      {showPacienteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setShowPacienteForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PacienteForm
              onSave={handleAposGravar}
              onCancel={() => setShowPacienteForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 