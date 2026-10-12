import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth';
import { AuthButton, AuthInput, AuthLink, AuthMessage, AuthScreen } from '@/components/AuthUI';

// Target of the link in the password reset e-mail (`${SITE_URL}/reset-password`).
// Supabase turns the link into a temporary session (web only, see detectSessionInUrl),
// which lets the user set a new password. This route stays reachable whether or not
// the user is signed in, so it is declared outside the guards in app/_layout.tsx.
export default function ResetPasswordScreen() {
  const router = useRouter();
  const { session, updatePassword } = useAuthContext();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <AuthScreen title="Link Expired" subtitle="This password reset link is invalid or has expired">
        <AuthButton label="Request a New Link" onPress={() => router.replace('/auth/forgot-password')} />
        <AuthLink label="Back to Sign In" onPress={() => router.replace('/auth/login')} />
      </AuthScreen>
    );
  }

  const handleSubmit = async () => {
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error ?? 'Unable to update the password.');
    }
  };

  return (
    <AuthScreen title="New Password" subtitle="Choose a new password for your account">
      {error ? <AuthMessage kind="error">{error}</AuthMessage> : null}

      <AuthInput
        placeholder={`New password (min. ${MIN_PASSWORD_LENGTH} characters)`}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
      />
      <AuthInput
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
        onSubmitEditing={handleSubmit}
      />
      <AuthButton label="Update Password" onPress={handleSubmit} loading={loading} />
    </AuthScreen>
  );
}
