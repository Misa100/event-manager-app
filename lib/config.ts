// Runtime configuration, read from EXPO_PUBLIC_* variables (.env.local, EAS secrets, CI).
// The fallbacks keep the current Supabase project working when no variable is set.
// The anon key is public by design: data access is protected by Row Level Security.

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://vkjmrtvgotssqfarfwbc.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZram1ydHZnb3Rzc3FmYXJmd2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDI5NDUsImV4cCI6MjA4MjA3ODk0NX0.Z346kph5J0Dngscg9leMHVQYCchjJiBwWtEzFefpFF8';

// Public base URL of the web app, used for the links in auth e-mails
// (/email-confirmed and /reset-password must exist there).
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? 'https://natively.dev').replace(/\/$/, '');
