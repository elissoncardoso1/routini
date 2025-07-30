import { useState, useCallback } from 'react';
import { ValidationSchema, validateForm } from '../utils/validation';

interface UseFormValidationProps<T> {
  initialData: T;
  schema: ValidationSchema;
  onSubmit: (data: T) => void | Promise<void>;
}

interface FormState<T> {
  data: T;
  errors: Record<string, string[]>;
  isValid: boolean;
  isSubmitting: boolean;
}

export function useFormValidation<T extends Record<string, unknown>>({
  initialData,
  schema,
  onSubmit
}: UseFormValidationProps<T>) {
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isValid: false,
    isSubmitting: false
  });

  // Função para atualizar um campo
  const updateField = useCallback((field: string, value: unknown) => {
    setState(prev => {
      const newData = { ...prev.data, [field]: value };
      const result = validateForm(newData, schema);
      
      return {
        ...prev,
        data: newData,
        errors: result.errors.reduce((acc, error) => {
          const [fieldName] = error.split(': ');
          if (!acc[fieldName]) acc[fieldName] = [];
          acc[fieldName].push(error.replace(`${fieldName}: `, ''));
          return acc;
        }, {} as Record<string, string[]>),
        isValid: result.isValid
      };
    });
  }, [schema]);

  // Função para validar um campo específico
  const validateField = useCallback((field: string, value: unknown) => {
    const fieldSchema = schema[field];
    if (!fieldSchema) return { isValid: true, errors: [] };

    // Implementação simplificada da validação
    const errors: string[] = [];
    
    if (fieldSchema.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(fieldSchema.message || 'Este campo é obrigatório');
    }
    
    if (fieldSchema.minLength && typeof value === 'string' && value.length < fieldSchema.minLength) {
      errors.push(fieldSchema.message || `Mínimo de ${fieldSchema.minLength} caracteres`);
    }
    
    if (fieldSchema.maxLength && typeof value === 'string' && value.length > fieldSchema.maxLength) {
      errors.push(fieldSchema.message || `Máximo de ${fieldSchema.maxLength} caracteres`);
    }
    
    if (fieldSchema.pattern && typeof value === 'string' && !fieldSchema.pattern.test(value)) {
      errors.push(fieldSchema.message || 'Formato inválido');
    }
    
    return { isValid: errors.length === 0, errors };
  }, [schema]);

  // Função para submeter o formulário
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const result = validateForm(state.data, schema);
      
      if (result.isValid) {
        await onSubmit(state.data);
        // Reset form after successful submission
        setState({
          data: initialData,
          errors: {},
          isValid: false,
          isSubmitting: false
        });
      } else {
        // Update errors
        const errors = result.errors.reduce((acc, error) => {
          const [fieldName] = error.split(': ');
          if (!acc[fieldName]) acc[fieldName] = [];
          acc[fieldName].push(error.replace(`${fieldName}: `, ''));
          return acc;
        }, {} as Record<string, string[]>);
        
        setState(prev => ({
          ...prev,
          errors,
          isValid: false,
          isSubmitting: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }));
      console.error('Erro ao submeter formulário:', error);
    }
  }, [state.data, schema, onSubmit, initialData]);

  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    setState({
      data: initialData,
      errors: {},
      isValid: false,
      isSubmitting: false
    });
  }, [initialData]);

  // Função para obter erros de um campo específico
  const getFieldErrors = useCallback((field: string): string[] => {
    return state.errors[field] || [];
  }, [state.errors]);

  // Função para verificar se um campo tem erro
  const hasFieldError = useCallback((field: string): boolean => {
    return state.errors[field] && state.errors[field].length > 0;
  }, [state.errors]);

  return {
    data: state.data,
    errors: state.errors,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    updateField,
    validateField,
    handleSubmit,
    resetForm,
    getFieldErrors,
    hasFieldError
  };
} 