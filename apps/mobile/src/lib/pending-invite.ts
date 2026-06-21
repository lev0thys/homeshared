import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'homeshared/pending-invite-token';

export async function setPendingInviteToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, token.trim());
}

export async function peekPendingInviteToken(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw?.trim() || null;
}

/** Lit et efface le token en attente (après connexion réussie). */
export async function consumePendingInviteToken(): Promise<string | null> {
  const token = await peekPendingInviteToken();
  if (token) await AsyncStorage.removeItem(STORAGE_KEY);
  return token;
}

export async function clearPendingInviteToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
