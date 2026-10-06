import { Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CALENDAR_INTEGRATION_UNAVAILABLE, useCalendarSync } from '@/hooks/useCalendarSync';
import { CalendarProvider } from '@/types/calendar';

/**
 * Calendar and third-party integrations.
 *
 * None of these integrations is implemented: connecting an account needs an
 * OAuth flow and server-side token storage. Every provider is shown as not
 * connected and every connect or sync control is disabled, with the reason
 * visible above them. Nothing here may simulate a connection or a sync.
 */

const UNAVAILABLE_NOTE_ID = 'integracoes-indisponiveis';

const providerNames: Record<CalendarProvider, string> = {
  google: 'Google Calendar',
  outlook: 'Outlook / Microsoft 365',
};

export const CalendarIntegrations = () => {
  const { connections } = useCalendarSync();

  const renderUnavailableRow = (name: string, detail: string) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
      <Button variant="outline" size="sm" disabled aria-describedby={UNAVAILABLE_NOTE_ID}>
        Conectar
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <p
        id={UNAVAILABLE_NOTE_ID}
        className="rounded-lg border border-[hsl(var(--alert-info-border))] bg-[hsl(var(--alert-info-bg))] p-4 text-sm text-[hsl(var(--alert-info-text))]"
      >
        {CALENDAR_INTEGRATION_UNAVAILABLE}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Calendários
          </CardTitle>
          <CardDescription>Reuniões com famílias, prazos de PEI e formações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(providerNames) as CalendarProvider[]).map((provider) => (
            <div key={provider}>
              {renderUnavailableRow(
                providerNames[provider],
                connections[provider].connected ? 'Conectado' : 'Não conectado'
              )}
            </div>
          ))}
          <div className="flex justify-end border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled
              aria-describedby={UNAVAILABLE_NOTE_ID}
              className="gap-2"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Sincronizar agora
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>{renderUnavailableRow('Gmail', 'Não conectado')}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderUnavailableRow('Google Drive', 'Documentos e evidências · não conectado')}
          {renderUnavailableRow('OneDrive', 'Não conectado')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comunicação</CardTitle>
        </CardHeader>
        <CardContent>
          {renderUnavailableRow('WhatsApp Business', 'Notificações via WhatsApp · não conectado')}
        </CardContent>
      </Card>
    </div>
  );
};
