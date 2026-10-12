
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { TablesInsert, TablesUpdate } from '../lib/supabase/types';
import { VENUE_SELECT, VenueRow, mapVenue } from '../lib/mappers';
import type { Venue } from '../types';


type VenueInsert = TablesInsert<'venues'>;
type VenueUpdate = TablesUpdate<'venues'>;

export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = async () => {
    try {
      console.log('[useVenues] Fetching venues');
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select(VENUE_SELECT)
        .order('rating', { ascending: false });

      if (error) {
        console.error('[useVenues] Fetch error:', error);
        setError(error.message);
        return;
      }

      console.log('[useVenues] Fetched venues:', data?.length);
      setVenues(((data ?? []) as VenueRow[]).map(mapVenue));
      setError(null);
    } catch (err) {
      console.error('[useVenues] Fetch exception:', err);
      setError('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const createVenue = async (venue: VenueInsert) => {
    try {
      console.log('[useVenues] Creating venue:', venue.name);
      const { data, error } = await supabase
        .from('venues')
        .insert(venue)
        .select()
        .single();

      if (error) {
        console.error('[useVenues] Create error:', error);
        throw error;
      }

      console.log('[useVenues] Venue created:', data.id);
      await fetchVenues();
      return { success: true, data };
    } catch (err) {
      console.error('[useVenues] Create exception:', err);
      return { success: false, error: err };
    }
  };

  const updateVenue = async (id: string, updates: VenueUpdate) => {
    try {
      console.log('[useVenues] Updating venue:', id);
      const { data, error } = await supabase
        .from('venues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useVenues] Update error:', error);
        throw error;
      }

      console.log('[useVenues] Venue updated:', data.id);
      await fetchVenues();
      return { success: true, data };
    } catch (err) {
      console.error('[useVenues] Update exception:', err);
      return { success: false, error: err };
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      console.log('[useVenues] Deleting venue:', id);
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useVenues] Delete error:', error);
        throw error;
      }

      console.log('[useVenues] Venue deleted:', id);
      await fetchVenues();
      return { success: true };
    } catch (err) {
      console.error('[useVenues] Delete exception:', err);
      return { success: false, error: err };
    }
  };

  return {
    venues,
    loading,
    error,
    fetchVenues,
    createVenue,
    updateVenue,
    deleteVenue,
  };
}
