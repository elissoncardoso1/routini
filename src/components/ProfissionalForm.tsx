import { useState } from 'react';
import { Profissional, Funcao, CORES_FUNCAO } from '../types';
import { db } from '../db';

interface ProfissionalFormProps {
  profissional?: Profissional;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfissionalForm({ profissional, onSave, onCancel }: ProfissionalFormProps) {
  const [nome, setNome] = useState(profissional?.nome || '');
  const [funcao, setFuncao] = useState<Funcao>(profissional?.funcao || 'Analista do Comportamento');
  const [disponibilidade, setDisponibilidade] = useState<{ dia: number; turno: 'manhã' | 'tarde' | 'noite' }[]>(
    profissional?.disponibilidade || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoProfissional: Omit<Profissional, 'id'> = {
      nome,
      funcao,
      disponibilidade,
      cor: CORES_FUNCAO[funcao]
    };

    try {
      if (profissional) {
        await db.profissionais.update(profissional.id, novoProfissional);
      } else {
        await db.profissionais.add({
          ...novoProfissional,
          id: crypto.randomUUID()
        });
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    }
  };

  const handleAddDisponibilidade = () => {
    setDisponibilidade([...disponibilidade, { dia: 0, turno: 'manhã' }]);
  };

  const handleRemoveDisponibilidade = (index: number) => {
    setDisponibilidade(disponibilidade.filter((_, i) => i !== index));
  };

  const handleDisponibilidadeChange = (index: number, field: 'dia' | 'turno', value: number | 'manhã' | 'tarde' | 'noite') => {
    const newDisponibilidade = [...disponibilidade];
    newDisponibilidade[index] = { ...newDisponibilidade[index], [field]: value };
    setDisponibilidade(newDisponibilidade);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="funcao" className="block text-sm font-medium text-gray-700">
          Função
        </label>
        <select
          id="funcao"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value as Funcao)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        >
          {Object.keys(CORES_FUNCAO).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Disponibilidade</label>
        <div className="mt-2 space-y-2">
          {disponibilidade.map((disp, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={disp.dia}
                onChange={(e) => handleDisponibilidadeChange(index, 'dia', parseInt(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value={0}>Domingo</option>
                <option value={1}>Segunda</option>
                <option value={2}>Terça</option>
                <option value={3}>Quarta</option>
                <option value={4}>Quinta</option>
                <option value={5}>Sexta</option>
                <option value={6}>Sábado</option>
              </select>
              <select
                value={disp.turno}
                onChange={(e) => handleDisponibilidadeChange(index, 'turno', e.target.value as 'manhã' | 'tarde' | 'noite')}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="manhã">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveDisponibilidade(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDisponibilidade}
            className="text-primary-600 hover:text-primary-800"
          >
            Adicionar disponibilidade
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
} 