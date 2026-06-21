import '@/nativewind-setup';
import '../global.css';
import '@/lib/i18n';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session.store';
import { initAppAds } from '@/lib/ads-init';
import { useShoppingTripAutoCommit } from '@/hooks/useShoppingTripAutoCommit';

function AppShell() {
  useShoppingTripAutoCommit();
  return <Slot />;
}

export default function RootLayout() {
  const setSession = useSessionStore((s) => s.setSession);

  useEffect(() => {
    void initAppAds();
  }, []);

  useEffect(() => {
    // Récupère la session courante au démarrage puis écoute les changements
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => sub.subscription.unsubscribe();
  }, [setSession]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppShell />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
