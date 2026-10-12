import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

const isWeb = Platform.OS === 'web';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // On the web the e-mail links (confirmation, password recovery) land on this app
    // with the tokens in the URL, which the client must read.
    detectSessionInUrl: isWeb,
  },
})

// On native, only refresh the token while the app is in the foreground.
if (!isWeb) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
