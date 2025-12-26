
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '../lib/supabase/types';

type Event = Tables<'events'>;
type EventInsert = TablesInsert<'events'>;
type EventUpdate = TablesUpdate<'events'>;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      console.log('[useEvents] Fetching events');
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('[useEvents] Fetch error:', error);
        setError(error.message);
        return;
      }

      console.log('[useEvents] Fetched events:', data?.length);
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error('[useEvents] Fetch exception:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (event: EventInsert) => {
    try {
      console.log('[useEvents] Creating event:', event.title);
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) {
        console.error('[useEvents] Create error:', error);
        throw error;
      }

      console.log('[useEvents] Event created:', data.id);
      await fetchEvents();
      return { success: true, data };
    } catch (err) {
      console.error('[useEvents] Create exception:', err);
      return { success: false, error: err };
    }
  };

  const updateEvent = async (id: string, updates: EventUpdate) => {
    try {
      console.log('[useEvents] Updating event:', id);
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useEvents] Update error:', error);
        throw error;
      }

      console.log('[useEvents] Event updated:', data.id);
      await fetchEvents();
      return { success: true, data };
    } catch (err) {
      console.error('[useEvents] Update exception:', err);
      return { success: false, error: err };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      console.log('[useEvents] Deleting event:', id);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useEvents] Delete error:', error);
        throw error;
      }

      console.log('[useEvents] Event deleted:', id);
      await fetchEvents();
      return { success: true };
    } catch (err) {
      console.error('[useEvents] Delete exception:', err);
      return { success: false, error: err };
    }
  };

  const assignProvider = async (eventId: string, providerId: string, serviceType: string) => {
    try {
      console.log('[useEvents] Assigning provider to event:', eventId, providerId);
      const { error } = await supabase
        .from('event_providers')
        .insert({
          event_id: eventId,
          provider_id: providerId,
          service_type: serviceType,
        });

      if (error) {
        console.error('[useEvents] Assign provider error:', error);
        throw error;
      }

      console.log('[useEvents] Provider assigned successfully');
      return { success: true };
    } catch (err) {
      console.error('[useEvents] Assign provider exception:', err);
      return { success: false, error: err };
    }
  };

  const removeProvider = async (eventId: string, providerId: string) => {
    try {
      console.log('[useEvents] Removing provider from event:', eventId, providerId);
      const { error } = await supabase
        .from('event_providers')
        .delete()
        .eq('event_id', eventId)
        .eq('provider_id', providerId);

      if (error) {
        console.error('[useEvents] Remove provider error:', error);
        throw error;
      }

      console.log('[useEvents] Provider removed successfully');
      return { success: true };
    } catch (err) {
      console.error('[useEvents] Remove provider exception:', err);
      return { success: false, error: err };
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    assignProvider,
    removeProvider,
  };
}
