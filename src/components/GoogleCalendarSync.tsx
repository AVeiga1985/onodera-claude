
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, RefreshCw, Link } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface GoogleCalendarSyncProps {
  onEventsSync?: (events: any[]) => void;
}

export function GoogleCalendarSync({ onEventsSync }: GoogleCalendarSyncProps) {
  const { isLoading, isConnected, connectGoogleCalendar, syncEvents } = useGoogleCalendar();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    const events = await syncEvents();
    if (events.length > 0) {
      setLastSync(new Date());
      onEventsSync?.(events);
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
            <p className="text-sm text-gray-600">
              Conecte sua conta do Google para sincronizar eventos
            </p>
            <Button 
              onClick={connectGoogleCalendar}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link className="w-4 h-4 mr-2" />
              {isLoading ? 'Conectando...' : 'Conectar Google Calendar'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-600">
                ✓ Google Calendar conectado
              </p>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  Última sincronização: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button 
              onClick={handleSync}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Sincronizando...' : 'Sincronizar Eventos'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
