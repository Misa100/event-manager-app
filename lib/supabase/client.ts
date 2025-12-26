import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://vkjmrtvgotssqfarfwbc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZram1ydHZnb3Rzc3FmYXJmd2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDI5NDUsImV4cCI6MjA4MjA3ODk0NX0.Z346kph5J0Dngscg9leMHVQYCchjJiBwWtEzFefpFF8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
