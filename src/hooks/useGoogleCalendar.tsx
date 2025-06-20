
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useGoogleCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectGoogleCalendar = async () => {
    try {
      setIsLoading(true);
      
      // Autenticar com Google usando Supabase OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: `${window.location.origin}/calendar`
        }
      });

      if (error) throw error;
      
      setIsConnected(true);
      toast({
        title: "Google Calendar conectado!",
        description: "Agora você pode sincronizar seus eventos.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao conectar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncEvents = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { action: 'sync_events' }
      });

      if (error) throw error;

      toast({
        title: "Eventos sincronizados!",
        description: `${data.events.length} eventos importados do Google Calendar.`,
      });

      return data.events;
    } catch (error: any) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { 
          action: 'create_event',
          ...eventData
        }
      });

      if (error) throw error;

      toast({
        title: "Evento criado!",
        description: "O evento foi adicionado ao Google Calendar.",
      });

      return data.event;
    } catch (error: any) {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isConnected,
    connectGoogleCalendar,
    syncEvents,
    createEvent
  };
}
