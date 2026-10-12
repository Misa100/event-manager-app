import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  MIN_PASSWORD_LENGTH,
  ROLE_LABELS,
  SELF_SERVICE_ROLES,
  isValidEmail,
} from '@/lib/auth';
import { Colors } from '@/styles/commonStyles';
import { AuthButton, AuthInput, AuthLink, AuthMessage, AuthScreen } from '@/components/AuthUI';
import type { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  // If e-mail confirmation is disabled, signUp returns a session and the route guard
  // in app/_layout.tsx takes over; otherwise we show the "check your inbox" state.
  const handleRegister = async () => {
    setError(null);

    if (!name.trim() || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name, role);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Unable to create the account.');
    } else if (result.needsEmailConfirmation) {
      setConfirmationSentTo(email.trim());
    }
  };

  if (confirmationSentTo) {
    return (
      <AuthScreen title="Check Your Email" subtitle="One more step to activate your account">
        <AuthMessage kind="success">
          We sent a confirmation link to {confirmationSentTo}. Open it, then sign in.
        </AuthMessage>
        <AuthButton label="Go to Sign In" onPress={() => router.replace('/auth/login')} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Create Account" subtitle="Sign up to get started">
      {error ? <AuthMessage kind="error">{error}</AuthMessage> : null}

      <AuthInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoComplete="name"
        editable={!loading}
      />
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
        placeholder={`Password (min. ${MIN_PASSWORD_LENGTH} characters)`}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
      />
      <AuthInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
        onSubmitEditing={handleRegister}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Account Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            enabled={!loading}
          >
            {SELF_SERVICE_ROLES.map((r) => (
              <Picker.Item key={r} label={ROLE_LABELS[r]} value={r} />
            ))}
          </Picker>
        </View>
      </View>

      <AuthButton label="Sign Up" onPress={handleRegister} loading={loading} />
      <AuthLink
        label="Already have an account? Sign In"
        onPress={() => router.replace('/auth/login')}
        disabled={loading}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  picker: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
