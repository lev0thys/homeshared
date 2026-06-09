import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import type { SupportedStorage } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { env } from './env';

/** Sur le web, AsyncStorage peut faire échouer l'auth → localStorage obligatoire. */
const authStorage: SupportedStorage =
  Platform.OS === 'web'
    ? {
        getItem: (key) => Promise.resolve(globalThis.localStorage?.getItem(key) ?? null),
        setItem: (key, value) => {
          globalThis.localStorage?.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key) => {
          globalThis.localStorage?.removeItem(key);
          return Promise.resolve();
        },
      }
    : AsyncStorage;

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.error(
    'Supabase non configuré : vérifie apps/mobile/.env (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)',
  );
}

/**
 * Client Supabase pour le mobile et le web (RN Web).
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
