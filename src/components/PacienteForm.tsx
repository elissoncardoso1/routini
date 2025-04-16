import { useState, useEffect } from 'react';
import { Paciente, Tag } from '../types/paciente';
import { db } from '../db';
import { Profissional } from '../types';

interface PacienteFormProps {
  paciente?: Paciente;
  onSave: () => void;
  onCancel: () => void;
}

export function PacienteForm({ paciente: pacienteInicial, onSave, onCancel }: PacienteFormProps) {
  const [paciente, setPaciente] = useState<Partial<Paciente>>(pacienteInicial || {
    nome: '',
    dataNascimento: new Date(),
    diagnostico: '',
    responsavel: {
      nome: '',
      telefone: '',
      email: '',
    },
    observacoesClinicas: '',
    profissionais: [],
    status: 'ativo',
    tags: [],
    anotacoesEquipe: [],
  });

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    loadProfissionais();
    loadTags();
  }, []);

  const loadProfissionais = async () => {
    const allProfissionais = await db.profissionais.toArray();
    setProfissionais(allProfissionais);
  };

  const loadTags = async () => {
    const allTags = await db.tags.toArray();
    setTags(allTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (pacienteInicial) {
        await db.pacientes.update(pacienteInicial.id, {
          ...paciente,
          updatedAt: new Date(),
        });
      } else {
        const novoPaciente: Paciente = {
          ...paciente,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Paciente;

        await db.pacientes.add(novoPaciente);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            value={paciente.nome}
            onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="dataNascimento"
            value={paciente.dataNascimento?.toISOString().split('T')[0]}
            onChange={(e) => setPaciente({ ...paciente, dataNascimento: new Date(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="diagnostico" className="block text-sm font-medium text-gray-700">
            Diagnóstico
          </label>
          <input
            type="text"
            id="diagnostico"
            value={paciente.diagnostico}
            onChange={(e) => setPaciente({ ...paciente, diagnostico: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={paciente.status}
            onChange={(e) => setPaciente({ ...paciente, status: e.target.value as 'ativo' | 'inativo' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="observacoesClinicas" className="block text-sm font-medium text-gray-700">
            Observações Clínicas
          </label>
          <textarea
            id="observacoesClinicas"
            value={paciente.observacoesClinicas}
            onChange={(e) => setPaciente({ ...paciente, observacoesClinicas: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            rows={3}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Responsável</label>
          <div className="mt-1 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nome do Responsável"
                value={paciente.responsavel?.nome}
                onChange={(e) => setPaciente({
                  ...paciente,
                  responsavel: { ...paciente.responsavel!, nome: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Telefone"
                value={paciente.responsavel?.telefone}
                onChange={(e) => setPaciente({
                  ...paciente,
                  responsavel: { ...paciente.responsavel!, telefone: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={paciente.responsavel?.email}
                onChange={(e) => setPaciente({
                  ...paciente,
                  responsavel: { ...paciente.responsavel!, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Profissionais</label>
          <div className="mt-2 space-y-2">
            {profissionais.map((profissional) => (
              <div key={profissional.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`profissional-${profissional.id}`}
                  checked={paciente.profissionais?.some(p => p.id === profissional.id)}
                  onChange={(e) => {
                    const novosProfissionais = e.target.checked
                      ? [...(paciente.profissionais || []), { 
                          id: profissional.id, 
                          tipo: profissional.funcao as 'AT' | 'Fono' | 'TO' | 'Psicoterapeuta' | 'Analista do Comportamento' | 'Educador Físico' 
                        }]
                      : paciente.profissionais?.filter(p => p.id !== profissional.id) || [];
                    setPaciente({ ...paciente, profissionais: novosProfissionais });
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={`profissional-${profissional.id}`} className="ml-2 block text-sm text-gray-900">
                  {profissional.nome} ({profissional.funcao})
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-2 space-y-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={paciente.tags?.includes(tag.id)}
                  onChange={(e) => {
                    const novasTags = e.target.checked
                      ? [...(paciente.tags || []), tag.id]
                      : paciente.tags?.filter(t => t !== tag.id) || [];
                    setPaciente({ ...paciente, tags: novasTags });
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-900">
                  {tag.nome}
                </label>
              </div>
            ))}
          </div>
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