import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { isValidEmail } from '@/lib/auth';
import { AuthButton, AuthInput, AuthLink, AuthMessage, AuthScreen } from '@/components/AuthUI';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resendConfirmation } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);

  // On success the route guard in app/_layout.tsx moves the user to the app.
  const handleLogin = async () => {
    setError(null);
    setInfo(null);
    setCanResend(false);

    if (!isValidEmail(email) || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Unable to sign in.');
      setCanResend(!!result.needsEmailConfirmation);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const result = await resendConfirmation(email);
    setLoading(false);

    if (result.success) {
      setError(null);
      setCanResend(false);
      setInfo('Confirmation email sent. Check your inbox.');
    } else {
      setError(result.error ?? 'Unable to send the email.');
    }
  };

  return (
    <AuthScreen title="Welcome Back" subtitle="Sign in to continue">
      {error ? <AuthMessage kind="error">{error}</AuthMessage> : null}
      {info ? <AuthMessage kind="success">{info}</AuthMessage> : null}

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!loading}
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        editable={!loading}
        onSubmitEditing={handleLogin}
      />

      <AuthButton label="Sign In" onPress={handleLogin} loading={loading} />

      {canResend ? (
        <AuthLink label="Resend confirmation email" onPress={handleResend} disabled={loading} />
      ) : null}
      <AuthLink
        label="Forgot your password?"
        onPress={() => router.push('/auth/forgot-password')}
        disabled={loading}
      />
      <AuthLink
        label="Don't have an account? Sign Up"
        onPress={() => router.push('/auth/register')}
        disabled={loading}
      />
    </AuthScreen>
  );
}
