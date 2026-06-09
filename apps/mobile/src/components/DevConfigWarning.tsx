import { Text, View } from 'react-native';
import { isSupabaseConfigured, env } from '@/lib/env';

/** Bandeau dev si Supabase n'est pas chargé (évite "Failed to fetch" opaque). */
export function DevConfigWarning() {
  if (!__DEV__ || isSupabaseConfigured()) {
    return null;
  }
  return (
    <View className="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-3">
      <Text className="text-amber-900 text-sm font-semibold">Config manquante</Text>
      <Text className="text-amber-800 text-xs mt-1">
        EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY est vide. Vérifie apps/mobile/.env puis
        relance `pnpm start:clear`.
      </Text>
      <Text className="text-amber-700 text-xs mt-1">API : {env.API_URL || '(vide)'}</Text>
    </View>
  );
}
