
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="formsheet" options={{ presentation: 'formSheet' }} />
        <Stack.Screen name="transparent-modal" options={{ presentation: 'transparentModal' }} />
      </Stack>
    </AuthProvider>
  );
}
