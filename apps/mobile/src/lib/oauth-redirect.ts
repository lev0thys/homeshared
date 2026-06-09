import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { env } from './env';

/**
 * URL de retour OAuth — doit être listée dans Supabase → Authentication → Redirect URLs.
 * Web prod : origine réelle du navigateur (évite mismatch alias Vercel).
 */
export function getOAuthRedirectUri(): string {
  if (Platform.OS === 'web' && typeof globalThis.window !== 'undefined') {
    return `${globalThis.window.location.origin}/auth/callback`;
  }
  if (env.SITE_URL) {
    return `${env.SITE_URL.replace(/\/$/, '')}/auth/callback`;
  }
  return makeRedirectUri({
    scheme: 'homeshared',
    path: 'auth/callback',
  });
}
