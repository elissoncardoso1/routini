export type Paciente = {
  id: string;
  nome: string;
  dataNascimento: Date;
  diagnostico: string;
  responsavel: {
    nome: string;
    telefone: string;
    email: string;
  };
  observacoesClinicas: string;
  profissionais: {
    id: string;
    tipo: 'AT' | 'Fono' | 'TO' | 'Psicoterapeuta' | 'Analista do Comportamento' | 'Educador Físico';
  }[];
  status: 'ativo' | 'inativo';
  tags: string[];
  foto?: string;
  anotacoesEquipe: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  nome: string;
  cor: string;
  descricao?: string;
}; 