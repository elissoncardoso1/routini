import { useState, useEffect } from 'react';
import { Profissional, Funcao, Disponibilidade } from '../types';
import { Dialog } from '@headlessui/react';
import { useFormValidation } from '../hooks/useFormValidation';
import { PROFISSIONAL_SCHEMA, sanitizeString } from '../utils/validation';

interface ProfissionalFormProps {
  profissional?: Profissional;
  onSave: (profissional: Profissional) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const FUNCOES: Funcao[] = [
  'Analista do Comportamento',
  'AT',
  'Supervisor Clínico',
  'Psicólogo Clínico',
  'Terapeuta Ocupacional',
  'Fonoaudiólogo',
  'Educador Físico',
  'Musicoterapeuta',
  'Pedagogo',
  'Nutricionista',
  'Médico',
  'Coordenador Clínico',
  'Recepcionista',
  'Estagiário'
];

const DIAS_SEMANA = [
  { valor: 0, nome: 'Domingo' },
  { valor: 1, nome: 'Segunda' },
  { valor: 2, nome: 'Terça' },
  { valor: 3, nome: 'Quarta' },
  { valor: 4, nome: 'Quinta' },
  { valor: 5, nome: 'Sexta' },
  { valor: 6, nome: 'Sábado' }
];

const TURNOS = ['manhã', 'tarde', 'noite'];

export function ProfissionalForm({ profissional, onSave, onCancel, isOpen }: ProfissionalFormProps) {
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);

  const initialData = {
    nome: profissional?.nome || '',
    funcao: profissional?.funcao || 'AT' as Funcao,
    cor: profissional?.cor || '#3B82F6'
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
    schema: PROFISSIONAL_SCHEMA,
    onSubmit: async (formData) => {
      const profissionalData: Profissional = {
        id: profissional?.id || crypto.randomUUID(),
        nome: sanitizeString(formData.nome),
        funcao: formData.funcao,
        disponibilidade,
        cor: formData.cor
      };
      
      onSave(profissionalData);
    }
  });

  useEffect(() => {
    if (profissional) {
      setDisponibilidade(profissional.disponibilidade);
    }
  }, [profissional]);

  const adicionarDisponibilidade = () => {
    setDisponibilidade([...disponibilidade, { dia: 1, turno: 'manhã' }]);
  };

  const removerDisponibilidade = (index: number) => {
    setDisponibilidade(disponibilidade.filter((_, i) => i !== index));
  };

  const atualizarDisponibilidade = (index: number, campo: keyof Disponibilidade, valor: number | string) => {
    const novaDisponibilidade = [...disponibilidade];
    novaDisponibilidade[index] = { ...novaDisponibilidade[index], [campo]: valor };
    setDisponibilidade(novaDisponibilidade);
  };

  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              {profissional ? 'Editar Profissional' : 'Novo Profissional'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  value={data.nome}
                  onChange={(e) => updateField('nome', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    hasFieldError('nome') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome completo"
                />
                {getFieldErrors('nome').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                ))}
              </div>

              {/* Função */}
              <div>
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
                  Função *
                </label>
                <select
                  id="funcao"
                  value={data.funcao}
                  onChange={(e) => updateField('funcao', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    hasFieldError('funcao') ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {FUNCOES.map(funcao => (
                    <option key={funcao} value={funcao}>{funcao}</option>
                  ))}
                </select>
                {getFieldErrors('funcao').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                ))}
              </div>

              {/* Cor */}
              <div>
                <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  id="cor"
                  value={data.cor}
                  onChange={(e) => updateField('cor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>

              {/* Disponibilidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidade
                </label>
                <div className="space-y-2">
                  {disponibilidade.map((disp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={disp.dia}
                        onChange={(e) => atualizarDisponibilidade(index, 'dia', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {DIAS_SEMANA.map(dia => (
                          <option key={dia.valor} value={dia.valor}>{dia.nome}</option>
                        ))}
                      </select>
                      
                      <select
                        value={disp.turno}
                        onChange={(e) => atualizarDisponibilidade(index, 'turno', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {TURNOS.map(turno => (
                          <option key={turno} value={turno}>{turno}</option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => removerDisponibilidade(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={adicionarDisponibilidade}
                    className="px-4 py-2 text-primary-500 hover:text-primary-600 border border-primary-300 rounded-md"
                  >
                    + Adicionar Disponibilidade
                  </button>
                </div>
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