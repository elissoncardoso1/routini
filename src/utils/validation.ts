// Tipos para validação
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Funções de sanitização
export const sanitizeString = (value: string): string => {
  if (typeof value !== 'string') return '';
  
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove tags HTML básicas
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limita o tamanho
};

export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeString(email);
  return sanitized.toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  return phone
    .replace(/\D/g, '') // Remove caracteres não numéricos
    .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') // Formata telefone
    .substring(0, 15);
};

export const sanitizeDate = (date: Date | string): Date => {
  if (date instanceof Date) {
    return new Date(date.getTime());
  }
  
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

// Funções de validação
export const validateRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const validateDate = (date: Date): boolean => {
  const now = new Date();
  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date(now.getFullYear() + 1, 11, 31);
  
  return date >= minDate && date <= maxDate;
};

// Função principal de validação
export const validateField = (value: unknown, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];
  
  // Validação de campo obrigatório
  if (rules.required && !validateRequired(value)) {
    errors.push(rules.message || 'Este campo é obrigatório');
    return { isValid: false, errors };
  }
  
  // Se o campo não é obrigatório e está vazio, é válido
  if (!rules.required && !validateRequired(value)) {
    return { isValid: true, errors: [] };
  }
  
  // Validação de comprimento mínimo
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    errors.push(rules.message || `Mínimo de ${rules.minLength} caracteres`);
  }
  
  // Validação de comprimento máximo
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    errors.push(rules.message || `Máximo de ${rules.maxLength} caracteres`);
  }
  
  // Validação de padrão
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Formato inválido');
  }
  
  // Validação customizada
  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.message || 'Valor inválido');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Função para validar um objeto completo
export const validateForm = (data: Record<string, unknown>, schema: ValidationSchema): ValidationResult => {
  const errors: string[] = [];
  let isValid = true;
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const result = validateField(value, rules);
    
    if (!result.isValid) {
      isValid = false;
      errors.push(...result.errors.map(error => `${field}: ${error}`));
    }
  }
  
  return { isValid, errors };
};

// Schemas de validação pré-definidos
export const PROFISSIONAL_SCHEMA: ValidationSchema = {
  nome: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Nome deve ter entre 2 e 100 caracteres'
  },
  funcao: {
    required: true,
    message: 'Função é obrigatória'
  }
};

export const PACIENTE_SCHEMA: ValidationSchema = {
  nome: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Nome deve ter entre 2 e 100 caracteres'
  },
  dataNascimento: {
    required: true,
    custom: (value) => validateDate(new Date(value as string)),
    message: 'Data de nascimento inválida'
  },
  diagnostico: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Diagnóstico deve ter entre 10 e 500 caracteres'
  },
  'responsavel.nome': {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Nome do responsável é obrigatório'
  },
  'responsavel.telefone': {
    required: true,
    custom: (value) => validatePhone(value as string),
    message: 'Telefone inválido'
  },
  'responsavel.email': {
    required: true,
    custom: (value) => validateEmail(value as string),
    message: 'Email inválido'
  }
};

export const ATENDIMENTO_SCHEMA: ValidationSchema = {
  profissionalId: {
    required: true,
    message: 'Profissional é obrigatório'
  },
  pacienteId: {
    required: true,
    message: 'Paciente é obrigatório'
  },
  inicio: {
    required: true,
    custom: (value) => validateDate(new Date(value as string)),
    message: 'Data de início inválida'
  },
  fim: {
    required: true,
    custom: (value) => validateDate(new Date(value as string)),
    message: 'Data de fim inválida'
  }
}; 