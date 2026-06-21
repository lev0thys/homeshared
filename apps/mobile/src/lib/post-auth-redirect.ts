import { router } from 'expo-router';
import { consumePendingInviteToken } from './pending-invite';

/** Redirige vers l'invitation en attente ou l'accueil après authentification. */
export async function redirectAfterAuth(): Promise<void> {
  const pending = await consumePendingInviteToken();
  if (pending) {
    router.replace(`/join?invite=${encodeURIComponent(pending)}` as never);
    return;
  }
  router.replace('/(app)');
}
