
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, RefreshCw, Link, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
}

export function GoogleCalendarSync({ onEventsSync }: GoogleCalendarSyncProps) {
  const { isLoading, isConnected, connectGoogleCalendar, syncEvents, checkConnection } = useGoogleCalendar();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Verificar conexão ao montar componente
    checkConnection();
  }, []);

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      const events = await syncEvents();
      if (events && events.length >= 0) {
        setLastSync(new Date());
        setSyncStatus('success');
        onEventsSync?.(events);
        
        // Reset status após 3 segundos
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleConnect = async () => {
    await connectGoogleCalendar();
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 mr-2 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 mr-2 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 mr-2" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Sincronizando...';
      case 'success':
        return 'Sincronizado!';
      case 'error':
        return 'Erro na sincronização';
      default:
        return 'Sincronizar Eventos';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>Conecte sua conta do Google para sincronizar eventos</span>
            </div>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Link className="w-4 h-4 mr-2" />
              {isLoading ? 'Conectando...' : 'Conectar Google Calendar'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Calendar conectado</span>
              </div>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  Última sincronização: {lastSync.toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleSync}
              disabled={isLoading || syncStatus === 'syncing'}
              variant="outline"
              size="sm"
              className={`w-full ${
                syncStatus === 'success' ? 'border-green-200 bg-green-50' :
                syncStatus === 'error' ? 'border-red-200 bg-red-50' : ''
              }`}
            >
              {getStatusIcon()}
              {getStatusText()}
            </Button>
            
            {syncStatus === 'success' && (
              <div className="text-xs text-green-600 text-center">
                Eventos sincronizados com sucesso!
              </div>
            )}
            
            {syncStatus === 'error' && (
              <div className="text-xs text-red-600 text-center">
                Falha na sincronização. Tente novamente.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
