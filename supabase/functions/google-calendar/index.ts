
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
      case 'check_connection':
        const isConnected = await checkGoogleConnection(user.id, supabaseClient);
        return new Response(JSON.stringify({ connected: isConnected }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'sync_events':
        const events = await syncGoogleCalendarEvents(user.id, supabaseClient);
        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_event':
        const newEvent = await createGoogleCalendarEvent(user.id, body, supabaseClient);
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

async function checkGoogleConnection(userId: string, supabase: any) {
  try {
    // Verificar se o usuário tem token de acesso do Google válido
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.provider_token) {
      return false;
    }

    // Testar conexão com Google Calendar API
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error checking Google connection:', error);
    return false;
  }
}

async function syncGoogleCalendarEvents(userId: string, supabase: any) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.provider_token) {
      throw new Error('No Google access token found');
    }

    // Obter eventos dos próximos 30 dias
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Mapear eventos do Google para formato local
    const events = data.items?.map((event: any) => ({
      id: `google-${event.id}`,
      title: event.summary || 'Sem título',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description || '',
      location: event.location || '',
      source: 'google',
      google_event_id: event.id
    })) || [];

    // Salvar eventos na tabela agendamento
    for (const event of events) {
      try {
        await supabase.from('agendamento').upsert({
          nome_completo: 'Google Calendar',
          data_agendamento: event.start,
          status: 'confirmado',
          email: 'google@calendar.com',
          telefone: '',
        }, {
          onConflict: 'data_agendamento,email'
        });
      } catch (error) {
        console.error('Error saving event to database:', error);
      }
    }

    return events;
  } catch (error) {
    console.error('Error syncing Google Calendar events:', error);
    throw error;
  }
}

async function createGoogleCalendarEvent(userId: string, eventData: any, supabase: any) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.provider_token) {
      throw new Error('No Google access token found');
    }

    const googleEvent = {
      summary: eventData.title,
      description: eventData.description || `Cliente: ${eventData.client}\nProfissional: ${eventData.employee}`,
      start: {
        dateTime: eventData.start,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.end || eventData.start,
        timeZone: 'America/Sao_Paulo',
      },
      location: eventData.location || '',
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEvent),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const createdEvent = await response.json();
    
    // Salvar também na tabela local
    await supabase.from('agendamento').insert({
      nome_completo: eventData.client || 'Cliente Google',
      data_agendamento: eventData.start,
      status: 'confirmado',
      email: eventData.email || 'google@calendar.com',
      telefone: eventData.phone || '',
    });

    return {
      id: `google-${createdEvent.id}`,
      ...eventData,
      google_event_id: createdEvent.id,
      source: 'google'
    };
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}
