
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '../lib/supabase/types';

type ServiceProvider = Tables<'service_providers'>;
type ServiceProviderInsert = TablesInsert<'service_providers'>;
type ServiceProviderUpdate = TablesUpdate<'service_providers'>;

export function useServiceProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async (serviceType?: string) => {
    try {
      console.log('[useServiceProviders] Fetching providers');
      setLoading(true);
      
      let query = supabase
        .from('service_providers')
        .select('*')
        .order('rating', { ascending: false });

      if (serviceType) {
        query = query.eq('service_type', serviceType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useServiceProviders] Fetch error:', error);
        setError(error.message);
        return;
      }

      console.log('[useServiceProviders] Fetched providers:', data?.length);
      setProviders(data || []);
      setError(null);
    } catch (err) {
      console.error('[useServiceProviders] Fetch exception:', err);
      setError('Failed to fetch service providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const createProvider = async (provider: ServiceProviderInsert) => {
    try {
      console.log('[useServiceProviders] Creating provider:', provider.name);
      const { data, error } = await supabase
        .from('service_providers')
        .insert(provider)
        .select()
        .single();

      if (error) {
        console.error('[useServiceProviders] Create error:', error);
        throw error;
      }

      console.log('[useServiceProviders] Provider created:', data.id);
      await fetchProviders();
      return { success: true, data };
    } catch (err) {
      console.error('[useServiceProviders] Create exception:', err);
      return { success: false, error: err };
    }
  };

  const updateProvider = async (id: string, updates: ServiceProviderUpdate) => {
    try {
      console.log('[useServiceProviders] Updating provider:', id);
      const { data, error } = await supabase
        .from('service_providers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useServiceProviders] Update error:', error);
        throw error;
      }

      console.log('[useServiceProviders] Provider updated:', data.id);
      await fetchProviders();
      return { success: true, data };
    } catch (err) {
      console.error('[useServiceProviders] Update exception:', err);
      return { success: false, error: err };
    }
  };

  const deleteProvider = async (id: string) => {
    try {
      console.log('[useServiceProviders] Deleting provider:', id);
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useServiceProviders] Delete error:', error);
        throw error;
      }

      console.log('[useServiceProviders] Provider deleted:', id);
      await fetchProviders();
      return { success: true };
    } catch (err) {
      console.error('[useServiceProviders] Delete exception:', err);
      return { success: false, error: err };
    }
  };

  return {
    providers,
    loading,
    error,
    fetchProviders,
    createProvider,
    updateProvider,
    deleteProvider,
  };
}
