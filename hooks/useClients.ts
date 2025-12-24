
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/app/integrations/supabase/types';

type Client = Tables<'clients'>;
type ClientInsert = TablesInsert<'clients'>;
type ClientUpdate = TablesUpdate<'clients'>;

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      console.log('[useClients] Fetching clients');
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useClients] Fetch error:', error);
        setError(error.message);
        return;
      }

      console.log('[useClients] Fetched clients:', data?.length);
      setClients(data || []);
      setError(null);
    } catch (err) {
      console.error('[useClients] Fetch exception:', err);
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async (client: ClientInsert) => {
    try {
      console.log('[useClients] Creating client:', client.name);
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (error) {
        console.error('[useClients] Create error:', error);
        throw error;
      }

      console.log('[useClients] Client created:', data.id);
      await fetchClients();
      return { success: true, data };
    } catch (err) {
      console.error('[useClients] Create exception:', err);
      return { success: false, error: err };
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      console.log('[useClients] Updating client:', id);
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useClients] Update error:', error);
        throw error;
      }

      console.log('[useClients] Client updated:', data.id);
      await fetchClients();
      return { success: true, data };
    } catch (err) {
      console.error('[useClients] Update exception:', err);
      return { success: false, error: err };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      console.log('[useClients] Deleting client:', id);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useClients] Delete error:', error);
        throw error;
      }

      console.log('[useClients] Client deleted:', id);
      await fetchClients();
      return { success: true };
    } catch (err) {
      console.error('[useClients] Delete exception:', err);
      return { success: false, error: err };
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
