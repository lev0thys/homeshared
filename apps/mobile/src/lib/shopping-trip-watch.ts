import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'homeshared/shopping-trip-watch';

export interface ShoppingTripWatch {
  groupId: string;
  purchasedCount: number;
  totalCount: number;
  backgroundAt: string | null;
}

export async function getShoppingTripWatch(): Promise<ShoppingTripWatch | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ShoppingTripWatch;
  } catch {
    return null;
  }
}

export async function setShoppingTripWatch(watch: ShoppingTripWatch): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(watch));
}

export async function updateShoppingTripProgress(
  groupId: string,
  purchasedCount: number,
  totalCount: number,
): Promise<void> {
  if (totalCount <= 0) {
    await clearShoppingTripWatch();
    return;
  }

  const prev = await getShoppingTripWatch();
  await setShoppingTripWatch({
    groupId,
    purchasedCount,
    totalCount,
    backgroundAt: prev?.groupId === groupId ? prev.backgroundAt : null,
  });
}

export async function markShoppingTripBackground(): Promise<void> {
  const watch = await getShoppingTripWatch();
  if (!watch || watch.purchasedCount <= 0) return;
  await setShoppingTripWatch({ ...watch, backgroundAt: new Date().toISOString() });
}

export async function clearShoppingTripWatch(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
