
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useGoogleCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { action: 'check_connection' }
      });

      if (error) throw error;
      setIsConnected(data.connected);
    } catch (error: any) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  const connectGoogleCalendar = async () => {
    try {
      setIsLoading(true);
      
      // Configurar OAuth com Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: `${window.location.origin}/calendar`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Erro ao conectar",
        description: error.message || "Não foi possível conectar com o Google Calendar",
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
        description: `${data.events?.length || 0} eventos importados do Google Calendar.`,
      });

      return data.events || [];
    } catch (error: any) {
      console.error('Error syncing events:', error);
      toast({
        title: "Erro na sincronização",
        description: error.message || "Não foi possível sincronizar os eventos",
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
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar evento",
        description: error.message || "Não foi possível criar o evento",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Detectar quando usuário retorna do OAuth
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.provider_token) {
        setIsConnected(true);
        toast({
          title: "Google Calendar conectado!",
          description: "Agora você pode sincronizar seus eventos.",
        });
      }
    };

    // Escutar mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.provider_token) {
        setIsConnected(true);
        toast({
          title: "Google Calendar conectado!",
          description: "Agora você pode sincronizar seus eventos.",
        });
      }
    });

    handleAuthCallback();

    return () => subscription.unsubscribe();
  }, []);

  return {
    isLoading,
    isConnected,
    connectGoogleCalendar,
    syncEvents,
    createEvent,
    checkConnection
  };
}
