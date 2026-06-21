import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router } from 'expo-router';
import { redirectAfterAuth } from '@/lib/post-auth-redirect';
import { supabase } from '@/lib/supabase';

/**
 * Point de retour OAuth (web surtout). Échange le ?code= PKCE puis redirige vers l’app.
 */
export default function AuthCallbackScreen() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      try {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          const oauthError =
            url.searchParams.get('error_description') ?? url.searchParams.get('error');
          if (oauthError) {
            throw new Error(decodeURIComponent(oauthError));
          }
        }

        // detectSessionInUrl peut déjà avoir échangé le ?code= au chargement du client Supabase
        let {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        if (!session && typeof window !== 'undefined') {
          const code = new URL(window.location.href).searchParams.get('code');
          if (code) {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeErr) throw exchangeErr;
            ({ data: { session } } = await supabase.auth.getSession());
          }
        }

        if (!session) {
          throw new Error('Session introuvable après connexion Google.');
        }

        if (!cancelled) await redirectAfterAuth();
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Erreur de connexion Google.';
        setError(message);
        setTimeout(() => router.replace('/(auth)/login'), 3500);
      }
    }

    void finishAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-ink-50 px-6 gap-3">
      {error ? (
        <Text className="text-center text-red-600 text-sm">{error}</Text>
      ) : (
        <>
          <ActivityIndicator />
          <Text className="text-ink-500 text-sm">Connexion Google…</Text>
        </>
      )}
    </View>
  );
}
