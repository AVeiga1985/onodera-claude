
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, ...body } = await req.json();

    switch (action) {
      case 'sync_events':
        // Sincronizar eventos do Google Calendar
        const events = await syncGoogleCalendarEvents(user.id);
        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_event':
        // Criar evento no Google Calendar
        const newEvent = await createGoogleCalendarEvent(body);
        return new Response(JSON.stringify({ event: newEvent }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in google-calendar function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncGoogleCalendarEvents(userId: string) {
  // Aqui você implementaria a lógica para buscar eventos do Google Calendar
  // Por enquanto, retorno dados mock
  return [
    {
      id: 'google-1',
      title: 'Reunião Google',
      start: '2024-03-15T10:00:00',
      end: '2024-03-15T11:00:00',
      source: 'google'
    },
    {
      id: 'google-2', 
      title: 'Consulta Médica',
      start: '2024-03-15T14:00:00',
      end: '2024-03-15T15:00:00',
      source: 'google'
    }
  ];
}

async function createGoogleCalendarEvent(eventData: any) {
  // Aqui você implementaria a lógica para criar evento no Google Calendar
  console.log('Creating Google Calendar event:', eventData);
  return {
    id: `google-${Date.now()}`,
    ...eventData,
    source: 'google'
  };
}
