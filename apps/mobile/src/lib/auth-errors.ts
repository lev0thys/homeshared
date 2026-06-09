/** Traduit les erreurs réseau Supabase en messages utilisateur (FR). */
export function formatAuthError(err: { message: string }): string {
  const msg = err.message;
  if (msg === 'Failed to fetch' || msg.toLowerCase().includes('network')) {
    return (
      'Connexion impossible à Supabase. Vérifie internet, désactive les extensions (pub/CORS), ' +
      'puis relance Expo (pnpm start:clear). Si ça persiste, vérifie EXPO_PUBLIC_SUPABASE_* dans apps/mobile/.env.'
    );
  }
  if (msg.includes('User already registered')) {
    return 'Cet email est déjà utilisé. Connecte-toi ou utilise un autre email.';
  }
  if (msg.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (msg.includes('provider is not enabled')) {
    return 'Google n’est pas activé côté Supabase. Voir docs/AUTH-GOOGLE.md.';
  }
  if (msg.includes('redirect_uri_mismatch') || msg.toLowerCase().includes('redirect')) {
    return 'URL de retour OAuth incorrecte. Ajoute l’URL de callback dans Supabase (voir docs/AUTH-GOOGLE.md).';
  }
  return msg;
}
