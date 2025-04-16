import { Atendimento } from '../types';
import { db } from '../db';

export async function fetchAppointments(): Promise<Atendimento[]> {
  try {
    return await db.atendimentos.toArray();
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw new Error('Erro ao buscar agendamentos');
  }
}

export async function fetchRelatedAppointments(baseDate: Date, profissionalId: string, pacienteId: string): Promise<Atendimento[]> {
  try {
    // Buscar todos os atendimentos do mesmo profissional e paciente com data maior ou igual à data base
    const atendimentos = await db.atendimentos
      .filter(a => 
        a.profissionalId === profissionalId && 
        a.pacienteId === pacienteId && 
        a.inicio >= baseDate
      )
      .toArray();
    
    return atendimentos;
  } catch (error) {
    console.error('Erro ao buscar agendamentos relacionados:', error);
    throw new Error('Erro ao buscar agendamentos relacionados');
  }
}

export async function createAppointment(atendimento: Omit<Atendimento, 'id'>): Promise<Atendimento> {
  try {
    const novoAtendimento = {
      ...atendimento,
      id: crypto.randomUUID()
    };
    await db.atendimentos.add(novoAtendimento);
    return novoAtendimento;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw new Error('Erro ao criar agendamento');
  }
}

export async function updateAppointment(id: string, atendimento: Partial<Atendimento>): Promise<Atendimento> {
  try {
    await db.atendimentos.update(id, atendimento);
    const updated = await db.atendimentos.get(id);
    if (!updated) throw new Error('Agendamento não encontrado');
    return updated;
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    throw new Error('Erro ao atualizar agendamento');
  }
}

export async function cancelAppointment(id: string, motivoCancelamento: string): Promise<Atendimento> {
  try {
    const atendimento = await db.atendimentos.get(id);
    if (!atendimento) throw new Error('Agendamento não encontrado');
    
    await db.atendimentos.update(id, { 
      cancelado: true,
      motivoCancelamento,
      observacoes: atendimento.observacoes ? 
        `${atendimento.observacoes}\n[CANCELADO] ${motivoCancelamento}` : 
        `[CANCELADO] ${motivoCancelamento}`
    });
    
    const updated = await db.atendimentos.get(id);
    if (!updated) throw new Error('Agendamento não encontrado');
    return updated;
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    throw new Error('Erro ao cancelar agendamento');
  }
}

export async function cancelFutureAppointments(baseDate: Date, profissionalId: string, pacienteId: string, motivoCancelamento: string): Promise<number> {
  try {
    // Buscar todos os atendimentos futuros do mesmo profissional e paciente
    const futurosAtendimentos = await db.atendimentos
      .filter(a => 
        a.profissionalId === profissionalId && 
        a.pacienteId === pacienteId && 
        a.inicio > baseDate &&
        !a.cancelado
      )
      .toArray();
    
    // Cancelar cada um dos atendimentos
    const cancelPromises = futurosAtendimentos.map(a => 
      cancelAppointment(a.id, motivoCancelamento)
    );
    
    await Promise.all(cancelPromises);
    return futurosAtendimentos.length;
  } catch (error) {
    console.error('Erro ao cancelar agendamentos futuros:', error);
    throw new Error('Erro ao cancelar agendamentos futuros');
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    await db.atendimentos.delete(id);
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    throw new Error('Erro ao deletar agendamento');
  }
} 