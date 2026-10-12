import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { AuthButton, AuthScreen } from '@/components/AuthUI';

// Target of the link in the sign-up confirmation e-mail (`${SITE_URL}/email-confirmed`).
// Reachable whether or not the link also signed the user in (web), hence declared
// outside the guards in app/_layout.tsx.
export default function EmailConfirmedScreen() {
  const router = useRouter();
  const { session } = useAuthContext();

  return (
    <AuthScreen title="Email Confirmed" subtitle="Your account is ready">
      <AuthButton
        label={session ? 'Continue' : 'Sign In'}
        onPress={() => router.replace(session ? '/' : '/auth/login')}
      />
    </AuthScreen>
  );
}
