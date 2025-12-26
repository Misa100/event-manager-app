
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[useAuth] Initializing auth state');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[useAuth] Session retrieved:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[useAuth] Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      console.log('[useAuth] Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        console.error('[useAuth] Sign up error:', error);
        Alert.alert('Sign Up Error', error.message);
        return { success: false, error };
      }

      if (data.user) {
        console.log('[useAuth] User signed up successfully:', data.user.email);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role,
          });

        if (profileError) {
          console.error('[useAuth] Profile creation error:', profileError);
        }

        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account before signing in.',
          [{ text: 'OK' }]
        );
      }

      return { success: true, data };
    } catch (error) {
      console.error('[useAuth] Sign up exception:', error);
      Alert.alert('Error', 'An unexpected error occurred during sign up');
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[useAuth] Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth] Sign in error:', error);
        Alert.alert('Sign In Error', error.message);
        return { success: false, error };
      }

      console.log('[useAuth] User signed in successfully:', data.user?.email);
      Alert.alert('Success', 'You have been signed in successfully');
      return { success: true, data };
    } catch (error) {
      console.error('[useAuth] Sign in exception:', error);
      Alert.alert('Error', 'An unexpected error occurred during sign in');
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[useAuth] Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[useAuth] Sign out error:', error);
        Alert.alert('Sign Out Error', error.message);
        return { success: false, error };
      }

      console.log('[useAuth] User signed out successfully');
      Alert.alert('Success', 'You have been signed out');
      return { success: true };
    } catch (error) {
      console.error('[useAuth] Sign out exception:', error);
      Alert.alert('Error', 'An unexpected error occurred during sign out');
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('[useAuth] Resetting password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });

      if (error) {
        console.error('[useAuth] Password reset error:', error);
        Alert.alert('Password Reset Error', error.message);
        return { success: false, error };
      }

      console.log('[useAuth] Password reset email sent');
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      return { success: true };
    } catch (error) {
      console.error('[useAuth] Password reset exception:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return { success: false, error };
    }
  };

  return {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
