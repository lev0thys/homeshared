import { supabase } from './supabase';
import type { SignupInput } from '@homeshared/shared';

export interface AuthResult {
  ok: true;
  hasSession: boolean;
}

export interface AuthFailure {
  ok: false;
  message: string;
}

/**
 * Inscription email + métadonnées. Si Supabase ne renvoie pas de session (config projet),
 * tente une connexion immédiate avec le même mot de passe.
 */
export async function signUpWithEmail(
  input: SignupInput,
): Promise<AuthResult | AuthFailure> {
  const { email, password, username, displayName, isChild } = input;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName, is_child: isChild ?? false },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (data.session) {
    return { ok: true, hasSession: true };
  }

  const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
  if (loginErr) {
    return {
      ok: false,
      message:
        'Compte créé mais connexion automatique impossible. Vérifie ta boîte mail ou connecte-toi manuellement.',
    };
  }

  return { ok: true, hasSession: true };
}
