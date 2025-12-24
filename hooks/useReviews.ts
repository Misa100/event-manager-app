
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Tables, TablesInsert } from '@/app/integrations/supabase/types';

type Review = Tables<'reviews'>;
type ReviewInsert = TablesInsert<'reviews'>;

export function useReviews(providerId?: string, venueId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      console.log('[useReviews] Fetching reviews');
      setLoading(true);
      
      let query = supabase
        .from('reviews')
        .select('*')
        .order('date', { ascending: false });

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }
      
      if (venueId) {
        query = query.eq('venue_id', venueId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useReviews] Fetch error:', error);
        setError(error.message);
        return;
      }

      console.log('[useReviews] Fetched reviews:', data?.length);
      setReviews(data || []);
      setError(null);
    } catch (err) {
      console.error('[useReviews] Fetch exception:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [providerId, venueId]);

  const createReview = async (review: ReviewInsert) => {
    try {
      console.log('[useReviews] Creating review');
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) {
        console.error('[useReviews] Create error:', error);
        throw error;
      }

      console.log('[useReviews] Review created:', data.id);
      await fetchReviews();
      return { success: true, data };
    } catch (err) {
      console.error('[useReviews] Create exception:', err);
      return { success: false, error: err };
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
  };
}
