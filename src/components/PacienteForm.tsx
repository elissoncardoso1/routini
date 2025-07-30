import { useState, useEffect } from 'react';
import { Paciente } from '../types/paciente';
import { Profissional } from '../types';
import { Dialog } from '@headlessui/react';
import { useFormValidation } from '../hooks/useFormValidation';
import { PACIENTE_SCHEMA, sanitizeString, sanitizeEmail, sanitizePhone } from '../utils/validation';
import { db } from '../db';

interface PacienteFormProps {
  paciente?: Paciente;
  onSave: (paciente: Paciente) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function PacienteForm({ paciente, onSave, onCancel, isOpen }: PacienteFormProps) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissionais, setSelectedProfissionais] = useState<{ id: string; tipo: 'AT' | 'Fono' | 'TO' | 'Psicoterapeuta' | 'Analista do Comportamento' | 'Educador Físico' }[]>([]);

  const initialData = {
    nome: paciente?.nome || '',
    dataNascimento: paciente?.dataNascimento ? paciente.dataNascimento.toISOString().split('T')[0] : '',
    diagnostico: paciente?.diagnostico || '',
    'responsavel.nome': paciente?.responsavel.nome || '',
    'responsavel.telefone': paciente?.responsavel.telefone || '',
    'responsavel.email': paciente?.responsavel.email || '',
    observacoesClinicas: paciente?.observacoesClinicas || '',
    status: paciente?.status || 'ativo'
  };

  const { 
    data, 
    isValid, 
    isSubmitting, 
    updateField, 
    handleSubmit, 
    getFieldErrors, 
    hasFieldError 
  } = useFormValidation({
    initialData,
    schema: PACIENTE_SCHEMA,
    onSubmit: async (formData) => {
      const pacienteData: Paciente = {
        id: paciente?.id || crypto.randomUUID(),
        nome: sanitizeString(formData.nome),
        dataNascimento: new Date(formData.dataNascimento),
        diagnostico: sanitizeString(formData.diagnostico),
        responsavel: {
          nome: sanitizeString(formData['responsavel.nome']),
          telefone: sanitizePhone(formData['responsavel.telefone']),
          email: sanitizeEmail(formData['responsavel.email'])
        },
        observacoesClinicas: sanitizeString(formData.observacoesClinicas),
        profissionais: selectedProfissionais,
        status: formData.status as 'ativo' | 'inativo',
        tags: paciente?.tags || [],
        anotacoesEquipe: paciente?.anotacoesEquipe || [],
        foto: paciente?.foto,
        createdAt: paciente?.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      onSave(pacienteData);
    }
  });

  useEffect(() => {
    const loadProfissionais = async () => {
      try {
        const profs = await db.profissionais.toArray();
        setProfissionais(profs);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      }
    };
    loadProfissionais();
  }, []);

  useEffect(() => {
    if (paciente) {
      setSelectedProfissionais(paciente.profissionais);
    }
  }, [paciente]);

  const adicionarProfissional = () => {
    setSelectedProfissionais([...selectedProfissionais, { id: '', tipo: 'AT' }]);
  };

  const removerProfissional = (index: number) => {
    setSelectedProfissionais(selectedProfissionais.filter((_, i) => i !== index));
  };

  const atualizarProfissional = (index: number, campo: 'id' | 'tipo', valor: string) => {
    const novosProfissionais = [...selectedProfissionais];
    novosProfissionais[index] = { ...novosProfissionais[index], [campo]: valor };
    setSelectedProfissionais(novosProfissionais);
  };

  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              {paciente ? 'Editar Paciente' : 'Novo Paciente'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={data.nome}
                    onChange={(e) => updateField('nome', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      hasFieldError('nome') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome completo do paciente"
                  />
                  {getFieldErrors('nome').map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                  ))}
                </div>

                <div>
                  <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    id="dataNascimento"
                    value={data.dataNascimento}
                    onChange={(e) => updateField('dataNascimento', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      hasFieldError('dataNascimento') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldErrors('dataNascimento').map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                  ))}
                </div>
              </div>

              {/* Diagnóstico */}
              <div>
                <label htmlFor="diagnostico" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico *
                </label>
                <textarea
                  id="diagnostico"
                  value={data.diagnostico}
                  onChange={(e) => updateField('diagnostico', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    hasFieldError('diagnostico') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o diagnóstico do paciente"
                />
                {getFieldErrors('diagnostico').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                ))}
              </div>

              {/* Responsável */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-3">Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="responsavelNome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="responsavelNome"
                      value={data['responsavel.nome']}
                      onChange={(e) => updateField('responsavel.nome', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        hasFieldError('responsavel.nome') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nome do responsável"
                    />
                    {getFieldErrors('responsavel.nome').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="responsavelTelefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="responsavelTelefone"
                      value={data['responsavel.telefone']}
                      onChange={(e) => updateField('responsavel.telefone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        hasFieldError('responsavel.telefone') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {getFieldErrors('responsavel.telefone').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="responsavelEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="responsavelEmail"
                      value={data['responsavel.email']}
                      onChange={(e) => updateField('responsavel.email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        hasFieldError('responsavel.email') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="email@exemplo.com"
                    />
                    {getFieldErrors('responsavel.email').map((error, index) => (
                      <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profissionais */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissionais
                </label>
                <div className="space-y-2">
                  {selectedProfissionais.map((prof, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={prof.id}
                        onChange={(e) => atualizarProfissional(index, 'id', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Selecione um profissional</option>
                        {profissionais.map(profissional => (
                          <option key={profissional.id} value={profissional.id}>
                            {profissional.nome} - {profissional.funcao}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={prof.tipo}
                        onChange={(e) => atualizarProfissional(index, 'tipo', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="AT">AT</option>
                        <option value="Fono">Fono</option>
                        <option value="TO">TO</option>
                        <option value="Psicoterapeuta">Psicoterapeuta</option>
                        <option value="Analista do Comportamento">Analista do Comportamento</option>
                        <option value="Educador Físico">Educador Físico</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => removerProfissional(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={adicionarProfissional}
                    className="px-4 py-2 text-primary-500 hover:text-primary-600 border border-primary-300 rounded-md"
                  >
                    + Adicionar Profissional
                  </button>
                </div>
              </div>

              {/* Observações Clínicas */}
              <div>
                <label htmlFor="observacoesClinicas" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações Clínicas
                </label>
                <textarea
                  id="observacoesClinicas"
                  value={data.observacoesClinicas}
                  onChange={(e) => updateField('observacoesClinicas', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Observações clínicas adicionais"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 