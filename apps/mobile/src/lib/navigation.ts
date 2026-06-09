import { router } from 'expo-router';

/** Retour historique ou hub si la pile est vide (web / deep link). */
export function goBackOrHub(): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(app)' as never);
  }
}
