import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { isValidEmail } from '@/lib/auth';
import { AuthButton, AuthInput, AuthLink, AuthMessage, AuthScreen } from '@/components/AuthUI';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuthContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error ?? 'Unable to send the email.');
    }
  };

  return (
    <AuthScreen title="Reset Password" subtitle="We will email you a link to choose a new password">
      {error ? <AuthMessage kind="error">{error}</AuthMessage> : null}
      {sent ? (
        <AuthMessage kind="success">
          If an account exists for {email.trim()}, a reset link is on its way.
        </AuthMessage>
      ) : null}

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!loading}
        onSubmitEditing={handleSubmit}
      />
      <AuthButton
        label={sent ? 'Send Again' : 'Send Reset Link'}
        onPress={handleSubmit}
        loading={loading}
      />
      <AuthLink label="Back to Sign In" onPress={() => router.replace('/auth/login')} disabled={loading} />
    </AuthScreen>
  );
}
