import { useState, useEffect } from 'react';
import { Profissional, Paciente, Funcao, Atendimento, CORES_FUNCAO } from '../types';
import { db } from '../db';
import { cancelAppointment, cancelFutureAppointments } from '../services/appointments';

interface AgendamentoFormProps {
  atendimento?: Atendimento;
  onSave: () => void;
  onCancel: () => void;
}

export function AgendamentoForm({ atendimento, onSave, onCancel }: AgendamentoFormProps) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profissionalId, setProfissionalId] = useState(atendimento?.profissionalId || '');
  const [pacienteId, setPacienteId] = useState(atendimento?.pacienteId || '');
  const [tipo, setTipo] = useState<Funcao>(atendimento?.tipo || 'Analista do Comportamento');
  const [inicio, setInicio] = useState<Date>(atendimento?.inicio || new Date());
  const [fim, setFim] = useState<Date>(atendimento?.fim || new Date());
  const [observacoes, setObservacoes] = useState(atendimento?.observacoes || '');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [cancelarFuturos, setCancelarFuturos] = useState(false);

  useEffect(() => {
    loadProfissionais();
    loadPacientes();
  }, []);

  const loadProfissionais = async () => {
    const profs = await db.profissionais.toArray();
    setProfissionais(profs);
  };

  const loadPacientes = async () => {
    const pacs = await db.pacientes.toArray();
    setPacientes(pacs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (atendimento) {
      await db.atendimentos.update(atendimento.id, {
        profissionalId,
        pacienteId: pacienteId || undefined,
        tipo,
        inicio,
        fim,
        observacoes
      });
    } else {
      await db.atendimentos.add({
        id: crypto.randomUUID(),
        profissionalId,
        pacienteId: pacienteId || undefined,
        tipo,
        inicio,
        fim,
        observacoes
      });
    }
    
    onSave();
  };

  const handleCancelar = async () => {
    if (!atendimento || !motivoCancelamento) return;
    
    try {
      if (cancelarFuturos) {
        await cancelFutureAppointments(
          atendimento.inicio,
          atendimento.profissionalId,
          atendimento.pacienteId || '',
          motivoCancelamento
        );
      } else {
        await cancelAppointment(atendimento.id, motivoCancelamento);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao cancelar atendimento(s):', error);
      alert('Erro ao cancelar atendimento(s)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Profissional</label>
        <select
          value={profissionalId}
          onChange={(e) => setProfissionalId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.nome} - {prof.funcao}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Paciente (opcional)</label>
        <select
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Selecione um paciente</option>
          {pacientes.map(pac => (
            <option key={pac.id} value={pac.id}>
              {pac.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Atendimento</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as Funcao)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          {Object.keys(CORES_FUNCAO).map(funcao => (
            <option key={funcao} value={funcao}>
              {funcao}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Início</label>
        <input
          type="datetime-local"
          value={inicio.toISOString().slice(0, 16)}
          onChange={(e) => setInicio(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fim</label>
        <input
          type="datetime-local"
          value={fim.toISOString().slice(0, 16)}
          onChange={(e) => setFim(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        {atendimento && !atendimento.cancelado && (
          <button
            type="button"
            onClick={() => setShowCancelDialog(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Cancelar Atendimento
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md hover:bg-primary-600"
        >
          Salvar
        </button>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Atendimento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo do Cancelamento
                </label>
                <textarea
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                  required
                />
              </div>
              
              {atendimento && atendimento.pacienteId && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cancelarFuturos"
                    checked={cancelarFuturos}
                    onChange={(e) => setCancelarFuturos(e.target.checked)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cancelarFuturos" className="ml-2 block text-sm text-gray-900">
                    Cancelar também os próximos atendimentos deste paciente com este profissional
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleCancelar}
                  disabled={!motivoCancelamento}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
} 