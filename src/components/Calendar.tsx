import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { EventClickArg } from '@fullcalendar/core';
import { Atendimento } from '../types';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './Calendar.css';
import { useLocation } from 'react-router-dom';
import { CALENDAR_CONFIG } from '../constants/calendar';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { AgendamentoForm } from './AgendamentoForm';
import { Dialog } from '@headlessui/react';

export function Calendar() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Atendimento | undefined>(undefined);
  const calendarRef = useRef<FullCalendar>(null);

  const {
    events,
    loading,
    error,
    loadData
  } = useCalendarEvents();

  // Memoizar a configuração do calendário
  const calendarConfig = useMemo(() => ({
    ...CALENDAR_CONFIG,
    plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
    initialView: "timeGridWeek" as const
  }), []);

  // Efeito para verificar se há uma data selecionada na navegação
  useEffect(() => {
    if (location.state?.selectedDate && calendarRef.current) {
      const dateToGo = new Date(location.state.selectedDate);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(dateToGo);
    }
  }, [location.state?.selectedDate]);

  // Memoizar handlers para evitar re-criações
  const handleDateClick = useCallback(() => {
    setSelectedEvent(undefined);
    setModalOpen(true);
  }, []);

  const handleEventClick = useCallback((info: EventClickArg) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent({
        id: event.id,
        profissionalId: event.profissionalId,
        pacienteId: event.pacienteId,
        tipo: event.tipo,
        inicio: new Date(event.start),
        fim: new Date(event.end),
        observacoes: event.observacoes
      });
      setModalOpen(true);
    }
  }, [events]);

  const handleSaveAppointment = useCallback(async () => {
    await loadData();
    setModalOpen(false);
  }, [loadData]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedEvent(undefined);
  }, []);

  // Memoizar o evento de montagem do tooltip
  const handleEventDidMount = useCallback((info: any) => {
    tippy(info.el, {
      content: info.event.extendedProps.tooltip,
      placement: 'top',
      arrow: true,
      theme: 'light',
      allowHTML: true
    });
  }, []);

  // Memoizar o conteúdo do evento
  const handleEventContent = useCallback((arg: any) => {
    const icon = arg.event.extendedProps.icon ?? '📌';
    const [paciente, profissional] = arg.event.title.split(' - ');

    return (
      <div 
        className="h-full w-full px-2 py-1 rounded border-l-4 text-xs leading-tight overflow-hidden shadow-sm"
        style={{
          backgroundColor: arg.event.backgroundColor ?? '#f3f4f6',
          borderLeftColor: arg.event.borderColor ?? '#3b82f6',
          color: arg.event.textColor ?? '#111827'
        }}
      >
        <div className="font-semibold truncate flex items-center gap-1">
          {icon} {paciente}
        </div>
        <div className="text-[11px] text-gray-700 truncate">{profissional}</div>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-red-500">
        Erro ao carregar dados: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        {...calendarConfig}
        events={events}
        eventDidMount={handleEventDidMount}
        eventContent={handleEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                {selectedEvent ? 'Editar Atendimento' : 'Novo Atendimento'}
              </Dialog.Title>
              
              <AgendamentoForm
                atendimento={selectedEvent}
                onSave={handleSaveAppointment}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 