import { Calendar, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { CalendarProvider } from '@/types/calendar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Calendar Integrations Component
 * 
 * Provides UI for connecting and managing Google Calendar and Outlook synchronization.
 * 
 * STRUCTURE FOR FUTURE BACKEND:
 * - OAuth buttons trigger edge functions
 * - Sync settings stored in database
 * - Real-time sync status updates
 * - Token refresh handled automatically
 */

export const CalendarIntegrations = () => {
  const {
    connections,
    syncStatus,
    connectProvider,
    disconnectProvider,
    updateSyncSettings,
    triggerSync,
  } = useCalendarSync();

  const renderProviderCard = (provider: CalendarProvider) => {
    const connection = connections[provider];
    const isGoogle = provider === 'google';
    const providerName = isGoogle ? 'Google Calendar' : 'Outlook / Microsoft 365';
    const providerIcon = isGoogle ? '🗓️' : '📅';

    return (
      <Card key={provider}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{providerIcon}</span>
              <div>
                <CardTitle>{providerName}</CardTitle>
                <CardDescription>
                  {connection.connected ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Conectado{connection.email && `: ${connection.email}`}
                    </span>
                  ) : (
                    'Não conectado'
                  )}
                </CardDescription>
              </div>
            </div>
            <div>
              {connection.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectProvider(provider)}
                >
                  Desconectar
                </Button>
              ) : (
                <Button
                  onClick={() => connectProvider(provider)}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {connection.connected && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Última sincronização:
              </span>
              <span>
                {connection.lastSync
                  ? formatDistanceToNow(new Date(connection.lastSync), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : 'Nunca'}
              </span>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-semibold mb-3 block">
                Sincronizar automaticamente:
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${provider}-meetings`}
                    checked={connection.syncSettings.meetings}
                    onCheckedChange={(checked) =>
                      updateSyncSettings(provider, { meetings: checked as boolean })
                    }
                  />
                  <label htmlFor={`${provider}-meetings`} className="text-sm cursor-pointer">
                    Reuniões com famílias
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${provider}-deadlines`}
                    checked={connection.syncSettings.deadlines}
                    onCheckedChange={(checked) =>
                      updateSyncSettings(provider, { deadlines: checked as boolean })
                    }
                  />
                  <label htmlFor={`${provider}-deadlines`} className="text-sm cursor-pointer">
                    Prazos de PEI
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${provider}-trainings`}
                    checked={connection.syncSettings.trainings}
                    onCheckedChange={(checked) =>
                      updateSyncSettings(provider, { trainings: checked as boolean })
                    }
                  />
                  <label htmlFor={`${provider}-trainings`} className="text-sm cursor-pointer">
                    Formações e eventos
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${provider}-tasks`}
                    checked={connection.syncSettings.allTasks}
                    onCheckedChange={(checked) =>
                      updateSyncSettings(provider, { allTasks: checked as boolean })
                    }
                  />
                  <label htmlFor={`${provider}-tasks`} className="text-sm cursor-pointer">
                    Todas as tarefas
                  </label>
                </div>
              </div>
            </div>

            {/* Backend Implementation Note */}
            <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
              <p className="font-semibold mb-1">📝 Nota de Implementação:</p>
              <p>
                A sincronização bidirecional requer configuração de OAuth no Google Cloud Console
                {isGoogle && ' '} ou Azure/Microsoft 365{!isGoogle && ' '}. Tokens serão
                armazenados de forma segura no backend.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className={`h-5 w-5 ${syncStatus.inProgress ? 'animate-spin' : ''}`} />
            Status de Sincronização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {syncStatus.inProgress ? (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Sincronizando calendários...</span>
            </div>
          ) : syncStatus.error ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{syncStatus.error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Todos os calendários sincronizados</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              {syncStatus.lastSuccessful && (
                <span>
                  Última sincronização:{' '}
                  {formatDistanceToNow(new Date(syncStatus.lastSuccessful), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={triggerSync}
              disabled={syncStatus.inProgress}
              className="gap-2"
            >
              <RefreshCw className={`h-3 w-3 ${syncStatus.inProgress ? 'animate-spin' : ''}`} />
              Sincronizar Agora
            </Button>
          </div>

          {syncStatus.pendingChanges > 0 && (
            <Badge variant="secondary" className="w-fit">
              {syncStatus.pendingChanges} alterações pendentes
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Provider Cards */}
      {renderProviderCard('google')}
      {renderProviderCard('outlook')}

      {/* Email Integration */}
      <Card>
        <CardHeader>
          <CardTitle>📧 Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Gmail</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                patricia.cecy@gmail.com
              </p>
            </div>
            <Button variant="outline" size="sm">
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Integration */}
      <Card>
        <CardHeader>
          <CardTitle>☁️ Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Google Drive</p>
                <p className="text-sm text-muted-foreground">
                  Sincronizar documentos e evidências
                </p>
              </div>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uso:</span>
              <span>2.3 GB de 15 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '15.3%' }} />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">OneDrive</p>
                <p className="text-sm text-muted-foreground">Não conectado</p>
              </div>
              <Button size="sm">Conectar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Integration */}
      <Card>
        <CardHeader>
          <CardTitle>💬 Comunicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">WhatsApp Business</p>
              <p className="text-sm text-muted-foreground">
                Receber notificações via WhatsApp
              </p>
            </div>
            <Button size="sm">Conectar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">🔧 Guia de Implementação Backend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p className="font-semibold">Para ativar a sincronização real, configure:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              <strong>Google:</strong> Criar projeto no Google Cloud Console, habilitar Google
              Calendar API, configurar OAuth 2.0
            </li>
            <li>
              <strong>Microsoft:</strong> Registrar app no Azure AD, configurar permissões de
              Calendar API
            </li>
            <li>
              <strong>Backend:</strong> Criar edge functions para OAuth flow, token management, e
              sync logic
            </li>
            <li>
              <strong>Banco:</strong> Armazenar tokens criptografados, configurações de sync, e
              mapeamentos de eventos
            </li>
          </ol>
          <p className="mt-3 text-xs">
            Ver documentação completa em{' '}
            <code className="bg-white px-1 rounded">docs/calendar-sync.md</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
