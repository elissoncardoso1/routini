import { Funcao } from '../types';

export const CORES_FUNCAO: Record<Funcao, { bg: string; border: string; text: string; icon: string }> = {
  'Psicólogo Clínico': {
    bg: '#e0f2fe',
    border: '#0284c7',
    text: '#0c4a6e',
    icon: '🩺'
  },
  'Fonoaudiólogo': {
    bg: '#fef3c7',
    border: '#d97706',
    text: '#78350f',
    icon: '👄'
  },
  'Terapeuta Ocupacional': {
    bg: '#dcfce7',
    border: '#16a34a',
    text: '#14532d',
    icon: '🤲'
  },
  'Analista do Comportamento': {
    bg: '#fce7f3',
    border: '#db2777',
    text: '#831843',
    icon: '🎯'
  },
  'AT': {
    bg: '#f3e8ff',
    border: '#9333ea',
    text: '#581c87',
    icon: '👥'
  },
  'Supervisor Clínico': {
    bg: '#fef9c3',
    border: '#ca8a04',
    text: '#713f12',
    icon: '👨‍💼'
  },
  'Educador Físico': {
    bg: '#fee2e2',
    border: '#dc2626',
    text: '#7f1d1d',
    icon: '🏃'
  },
  'Musicoterapeuta': {
    bg: '#f3f4f6',
    border: '#4b5563',
    text: '#1f2937',
    icon: '🎵'
  },
  'Pedagogo': {
    bg: '#d9f99d',
    border: '#65a30d',
    text: '#365314',
    icon: '📚'
  },
  'Nutricionista': {
    bg: '#e0f2fe',
    border: '#0ea5e9',
    text: '#0c4a6e',
    icon: '🥗'
  },
  'Médico': {
    bg: '#fee2e2',
    border: '#dc2626',
    text: '#7f1d1d',
    icon: '👨‍⚕️'
  },
  'Coordenador Clínico': {
    bg: '#f5f5f4',
    border: '#292524',
    text: '#1c1917',
    icon: '👨‍💼'
  },
  'Recepcionista': {
    bg: '#e0f7fe',
    border: '#0891b2',
    text: '#164e63',
    icon: '👩‍💼'
  },
  'Estagiário': {
    bg: '#f3e8ff',
    border: '#9333ea',
    text: '#581c87',
    icon: '👨‍🎓'
  }
};

export const CALENDAR_CONFIG = {
  slotMinTime: "07:00:00",
  slotMaxTime: "20:00:00",
  height: "calc(100vh - 12rem)",
  eventMinHeight: 60,
  dayMaxEvents: 3,
  moreLinkText: "mais",
  allDaySlot: false,
  nowIndicator: true,
  locale: "pt-br",
  buttonText: {
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia'
  },
  views: {
    timeGridDay: {
      titleFormat: {
        year: 'numeric' as const,
        month: 'long' as const,
        day: 'numeric' as const,
        weekday: 'long' as const
      }
    },
    timeGridWeek: {
      titleFormat: {
        year: 'numeric' as const,
        month: 'long' as const
      },
      dayHeaderFormat: {
        weekday: 'short' as const,
        day: 'numeric' as const
      }
    },
    dayGridMonth: {
      titleFormat: {
        year: 'numeric' as const,
        month: 'long' as const
      },
      dayHeaderFormat: {
        weekday: 'short' as const
      }
    }
  },
  slotLabelFormat: [
    {
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      omitZeroMinute: false,
      meridiem: false
    }
  ]
}; 