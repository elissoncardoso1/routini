import Dexie, { Table } from 'dexie';
import { Profissional, Atendimento } from '../types';
import { Paciente, Tag } from '../types/paciente';

export class EscalaDatabase extends Dexie {
  profissionais!: Table<Profissional>;
  atendimentos!: Table<Atendimento>;
  pacientes!: Table<Paciente>;
  tags!: Table<Tag>;

  constructor() {
    super('EscalaDatabase');
    
    this.version(2).stores({
      profissionais: '++id, nome, funcao',
      atendimentos: '++id, profissionalId, pacienteId, inicio, fim',
      pacientes: '++id, nome, status, [profissionais.tipo]',
      tags: '++id, nome'
    });

    // Middleware para converter datas ao carregar dados
    this.atendimentos.hook('reading', atendimento => ({
      ...atendimento,
      inicio: new Date(atendimento.inicio),
      fim: new Date(atendimento.fim)
    }));

    this.pacientes.hook('reading', paciente => ({
      ...paciente,
      dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento) : undefined,
      createdAt: paciente.createdAt ? new Date(paciente.createdAt) : undefined,
      updatedAt: paciente.updatedAt ? new Date(paciente.updatedAt) : undefined
    }));
  }

  // Limpa todos os dados do banco
  async clearDatabase() {
    try {
      await this.transaction('rw', 
        [this.profissionais, this.atendimentos, this.pacientes, this.tags], 
        async () => {
          await Promise.all([
            this.profissionais.clear(),
            this.atendimentos.clear(),
            this.pacientes.clear(),
            this.tags.clear()
          ]);
        }
      );
      return true;
    } catch (error) {
      console.error("Erro ao limpar banco de dados:", error);
      throw error;
    }
  }

  // Exporta todos os dados do banco como JSON
  async exportData() {
    try {
      const data = {
        profissionais: await this.profissionais.toArray(),
        atendimentos: await this.atendimentos.toArray(),
        pacientes: await this.pacientes.toArray(),
        tags: await this.tags.toArray(),
        version: 2, // Versão atual do esquema
        timestamp: new Date().toISOString()
      };
      return data;
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      throw error;
    }
  }

  // Salva os dados como arquivo JSON para download
  async downloadBackup() {
    try {
      const data = await this.exportData();
      const json = JSON.stringify(data, (_key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }, 2);
      
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `routini-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer download do backup:", error);
      throw error;
    }
  }

  // Importa dados de um arquivo de backup
  async importData(data: {
    version?: number;
    profissionais?: Profissional[];
    atendimentos?: Atendimento[];
    pacientes?: Paciente[];
    tags?: Tag[];
  }) {
    try {
      // Verificar versão para garantir compatibilidade
      if (!data.version || data.version > 2) {
        throw new Error("Versão de backup incompatível");
      }

      // Iniciar transação para garantir integridade
      return await this.transaction('rw', 
        [this.profissionais, this.atendimentos, this.pacientes, this.tags], 
        async () => {
          // Limpar tabelas existentes
          await Promise.all([
            this.profissionais.clear(),
            this.atendimentos.clear(),
            this.pacientes.clear(),
            this.tags.clear()
          ]);
          
          // Converter strings ISO para objetos Date nas datas
          const processedAtendimentos = (data.atendimentos || []).map((atendimento: any) => ({
            ...atendimento,
            inicio: new Date(atendimento.inicio),
            fim: new Date(atendimento.fim)
          }));
          
          const processedPacientes = (data.pacientes || []).map((paciente: any) => ({
            ...paciente,
            dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento) : new Date()
          }));

          // Importar dados
          if (data.profissionais?.length) await this.profissionais.bulkAdd(data.profissionais);
          if (data.tags?.length) await this.tags.bulkAdd(data.tags);
          if (data.pacientes?.length) await this.pacientes.bulkAdd(processedPacientes);
          if (data.atendimentos?.length) await this.atendimentos.bulkAdd(processedAtendimentos);
          
          return true;
        }
      );
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      throw error;
    }
  }
}

export const db = new EscalaDatabase(); 