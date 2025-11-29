// Calendar Integration Types

export type CalendarProvider = 'google' | 'outlook';

export interface CalendarConnection {
  provider: CalendarProvider;
  connected: boolean;
  email?: string;
  lastSync?: string;
  syncEnabled: boolean;
  syncSettings: {
    meetings: boolean;
    deadlines: boolean;
    trainings: boolean;
    allTasks: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  reminders: ReminderSettings[];
  recurrence?: RecurrenceSettings;
  sourceProvider?: CalendarProvider;
  syncedToProviders: CalendarProvider[];
  relatedTo?: {
    type: 'student' | 'class' | 'pei';
    id: string;
    name: string;
  };
}

export interface ReminderSettings {
  type: 'email' | 'push' | 'sms';
  minutesBefore: number;
}

export interface RecurrenceSettings {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  count?: number;
}

export interface SyncStatus {
  inProgress: boolean;
  lastSuccessful?: string;
  lastAttempt?: string;
  error?: string;
  pendingChanges: number;
}

// OAuth state for future backend implementation
export interface OAuthState {
  provider: CalendarProvider;
  state: string;
  codeVerifier?: string; // For PKCE flow
  redirectUri: string;
}

// Token structure (to be stored securely in backend)
export interface CalendarTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string[];
}
