import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from './supabase';
import { getOAuthRedirectUri } from './oauth-redirect';

WebBrowser.maybeCompleteAuthSession();

export type GoogleAuthResult =
  | { ok: true; redirecting?: boolean }
  | { ok: false; message: string };

/**
 * Connexion / inscription via Google (même flux Supabase : compte créé au 1er passage).
 * Web : redirection pleine page vers /auth/callback.
 * Natif : session navigateur in-app puis échange du code PKCE.
 */
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  const redirectTo = getOAuthRedirectUri();

  if (Platform.OS === 'web') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, redirecting: true };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) return { ok: false, message: error.message };
  if (!data?.url) {
    return { ok: false, message: 'Impossible d’ouvrir la connexion Google.' };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { ok: false, message: 'Connexion Google annulée.' };
  }
  if (result.type !== 'success') {
    return { ok: false, message: 'Connexion Google interrompue.' };
  }

  const { params, errorCode } = QueryParams.getQueryParams(result.url);
  if (errorCode) {
    return { ok: false, message: decodeURIComponent(errorCode) };
  }

  const authError = params.error_description ?? params.error;
  if (authError) {
    return { ok: false, message: decodeURIComponent(String(authError)) };
  }

  if (params.code) {
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(params.code);
    if (exchangeErr) return { ok: false, message: exchangeErr.message };
    return { ok: true };
  }

  if (params.access_token && params.refresh_token) {
    const { error: sessionErr } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (sessionErr) return { ok: false, message: sessionErr.message };
    return { ok: true };
  }

  return { ok: false, message: 'Réponse Google invalide (code ou jetons manquants).' };
}
