import { useCallback, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import { SITE_URL } from '../lib/config';
import {
  AuthResult,
  EMAIL_NOT_CONFIRMED,
  friendlyAuthError,
  toRole,
  toSelfServiceRole,
} from '../lib/auth';
import type { Tables } from '../lib/supabase/types';
import type { UserRole } from '../types';

export type Profile = Tables<'profiles'>;

const unexpected = (): AuthResult => ({
  success: false,
  error: 'Something went wrong. Please try again.',
});

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load the profiles row of the signed-in user. If it does not exist yet (e.g. the
  // account was created while e-mail confirmation was pending), create it from the
  // sign-up metadata. `userId` is a primitive so token refreshes do not re-run this.
  const userId = user?.id;
  const userEmail = user?.email ?? '';
  const metaName = typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : '';
  const metaRole = user?.user_metadata?.role;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        console.error('[useAuth] Profile fetch error:', error.message);
        return;
      }
      if (data) {
        setProfile(data);
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          name: metaName || userEmail,
          role: toSelfServiceRole(metaRole),
        })
        .select()
        .maybeSingle();

      if (cancelled) return;
      if (insertError) {
        console.error('[useAuth] Profile creation error:', insertError.message);
        return;
      }
      setProfile(created);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, userEmail, metaName, metaRole]);

  const signUp = useCallback(
    async (email: string, password: string, name: string, role: string): Promise<AuthResult> => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${SITE_URL}/email-confirmed`,
            data: { name: name.trim(), role: toSelfServiceRole(role) },
          },
        });

        if (error) {
          return { success: false, error: friendlyAuthError(error) };
        }

        // For an already registered address Supabase answers with an obfuscated user
        // that has no identities (to avoid leaking which e-mails exist).
        if (data.user && data.user.identities?.length === 0) {
          return { success: false, error: 'An account with this email already exists.' };
        }

        return { success: true, needsEmailConfirmation: !data.session };
      } catch (err) {
        console.error('[useAuth] Sign up exception:', err);
        return unexpected();
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return {
          success: false,
          error: friendlyAuthError(error),
          ...(error.code === EMAIL_NOT_CONFIRMED ? { needsEmailConfirmation: true } : {}),
        };
      }
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Sign in exception:', err);
      return unexpected();
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: friendlyAuthError(error) };
      }
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Sign out exception:', err);
      return unexpected();
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${SITE_URL}/reset-password`,
      });
      if (error) {
        return { success: false, error: friendlyAuthError(error) };
      }
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Password reset exception:', err);
      return unexpected();
    }
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { success: false, error: friendlyAuthError(error) };
      }
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Password update exception:', err);
      return unexpected();
    }
  }, []);

  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: `${SITE_URL}/email-confirmed` },
      });
      if (error) {
        return { success: false, error: friendlyAuthError(error) };
      }
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Resend confirmation exception:', err);
      return unexpected();
    }
  }, []);

  // Role shown in the UI: the profiles row is the source of truth, the sign-up
  // metadata is only a fallback while it loads. Never trusted for authorization:
  // access control is enforced by Row Level Security.
  const role: UserRole | null = user ? toRole(profile?.role ?? user.user_metadata?.role) : null;

  return {
    session,
    user,
    profile,
    role,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
  };
}
