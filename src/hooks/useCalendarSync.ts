import { CalendarConnection, CalendarProvider, SyncStatus } from '@/types/calendar';

/**
 * Calendar Sync Hook
 *
 * No calendar integration exists in this prototype. Connecting a Google or
 * Microsoft account needs an OAuth flow and tokens kept on a server, and there
 * is no server. The hook therefore reports every provider as not connected and
 * exposes no action that could pretend to connect or sync.
 *
 * BACKEND IMPLEMENTATION REQUIRED:
 * - OAuth flow with Google/Microsoft
 * - Token storage and refresh
 * - Bidirectional sync logic
 */

export const CALENDAR_INTEGRATION_UNAVAILABLE =
  'Integrações não implementadas: conectar contas exige OAuth com servidor, e este protótipo não tem servidor. Nenhuma conta está conectada e nada é sincronizado.';

const notConnected = (provider: CalendarProvider): CalendarConnection => ({
  provider,
  connected: false,
  syncEnabled: false,
  syncSettings: {
    meetings: false,
    deadlines: false,
    trainings: false,
    allTasks: false,
  },
});

const connections: Record<CalendarProvider, CalendarConnection> = {
  google: notConnected('google'),
  outlook: notConnected('outlook'),
};

const syncStatus: SyncStatus = {
  inProgress: false,
  pendingChanges: 0,
};

export const useCalendarSync = () => ({ connections, syncStatus });
