import { Atendimento } from '../types';

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
        calendar: {
          events: {
            insert: (params: { calendarId: string; resource: { summary: string; description?: string; start: { dateTime: string }; end: { dateTime: string } } }) => Promise<{ result: { id: string; summary: string } }>;
          };
        };
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: { client_id: string; scope: string; callback: (response: { error?: string }) => void }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export async function initializeGoogleCalendar() {
  try {
    await new Promise<void>((resolve, reject) => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (response: { error?: string }) => {
          if (response.error) {
            throw new Error(response.error);
          }
        },
      });
    });
  } catch (error) {
    console.error('Erro ao inicializar Google Calendar:', error);
    throw error;
  }
}

export async function syncWithGoogleCalendar(atendimento: Atendimento) {
  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar',
              callback: async (response: { error?: string }) => {
          if (response.error) {
            throw new Error(response.error);
          }

        try {
          const response = await window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: {
              summary: `Atendimento - ${atendimento.pacienteId}`,
              description: atendimento.observacoes,
              start: {
                dateTime: atendimento.inicio.toISOString(),
              },
              end: {
                dateTime: atendimento.fim.toISOString(),
              },
            },
          });

          return response.result;
        } catch (error) {
          console.error('Erro ao criar evento:', error);
          throw error;
        }
      },
    });

    tokenClient.requestAccessToken();
  } catch (error) {
    console.error('Erro ao sincronizar com Google Calendar:', error);
    throw error;
  }
}

export async function syncAllAtendimentos(atendimentos: Atendimento[]) {
  for (const atendimento of atendimentos) {
    await syncWithGoogleCalendar(atendimento);
  }
} 