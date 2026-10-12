import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Route guard: signed-out users can only reach the auth screens, signed-in users only
// the app. When the session changes, expo-router redirects to the first accessible
// screen of the matching group. `reset-password` and `email-confirmed` are the targets
// of e-mail links and must work in both states, so they sit outside the guards.
function RootNavigator() {
  const { session, loading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();
  const wasSignedIn = useRef<boolean | null>(null);
  const isSignedIn = !!session;

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  // After a sign-in made on an auth screen, land on Home explicitly: left to the guard
  // alone, the web URL ends up on whichever tab was declared first. Skipped on the
  // e-mail link pages, where the user must stay put even though the link signs them in.
  useEffect(() => {
    if (loading) return;
    const justSignedIn = wasSignedIn.current === false && isSignedIn;
    wasSignedIn.current = isSignedIn;

    const first = segments[0] as string | undefined;
    if (justSignedIn && first !== 'reset-password' && first !== 'email-confirmed') {
      router.replace('/');
    }
  }, [loading, isSignedIn, segments, router]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="formsheet" options={{ presentation: 'formSheet' }} />
        <Stack.Screen name="transparent-modal" options={{ presentation: 'transparentModal' }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/forgot-password" />
      </Stack.Protected>

      <Stack.Screen name="reset-password" />
      <Stack.Screen name="email-confirmed" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
