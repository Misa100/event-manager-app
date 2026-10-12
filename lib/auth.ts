import type { AuthError } from '@supabase/supabase-js';
import type { UserRole } from '@/types';

export type AuthResult = {
  success: boolean;
  error?: string;
  /** Sign-up succeeded but the e-mail must be confirmed before signing in. */
  needsEmailConfirmation?: boolean;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  client: 'Client',
  service_provider: 'Service Provider',
  venue_owner: 'Venue Owner',
};

/** Roles a user may pick for themselves at sign-up. `admin` is never self-service. */
export const SELF_SERVICE_ROLES: UserRole[] = ['client', 'service_provider', 'venue_owner'];

export const MIN_PASSWORD_LENGTH = 8;

/** Known role, restricted to self-service ones, defaulting to `client`. */
export function toSelfServiceRole(role: unknown): UserRole {
  return SELF_SERVICE_ROLES.includes(role as UserRole) ? (role as UserRole) : 'client';
}

/** Any known role (e.g. read from the profiles table), defaulting to `client`. */
export function toRole(role: unknown): UserRole {
  return typeof role === 'string' && role in ROLE_LABELS ? (role as UserRole) : 'client';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Error returned by signIn when the account exists but the e-mail is not confirmed. */
export const EMAIL_NOT_CONFIRMED = 'email_not_confirmed';

export function friendlyAuthError(error: Pick<AuthError, 'message' | 'code'>): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Incorrect email or password.';
    case EMAIL_NOT_CONFIRMED:
      return 'Please confirm your email address before signing in.';
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists.';
    case 'weak_password':
      return `Password is too weak. Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    case 'same_password':
      return 'The new password must be different from the old one.';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
}
