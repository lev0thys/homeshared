import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { hasGroupFeature } from '@homeshared/shared';
import { api } from '@/lib/api-client';
import { mondayIsoUtc } from '@/lib/week-dates';
import type { MealPlanWeek } from '@/components/meal-plan/types';

interface ShoppingRow {
  id: string;
  purchasedAt: string | null;
}

interface FridgeResponse {
  items: unknown[];
}

interface GroupStatusStripProps {
  groupId: string;
  features: string[];
}

export function GroupStatusStrip({ groupId, features }: GroupStatusStripProps) {
  const { t } = useTranslation();
  const weekStart = mondayIsoUtc();

  const [shoppingQ, fridgeQ, planQ] = useQueries({
    queries: [
      {
        queryKey: ['shopping', groupId],
        queryFn: (): Promise<ShoppingRow[]> =>
          api.get<ShoppingRow[]>(`/api/shopping/${groupId}`),
        enabled: hasGroupFeature(features, 'SHOPPING'),
        staleTime: 30_000,
      },
      {
        queryKey: ['fridge', groupId],
        queryFn: (): Promise<FridgeResponse> => api.get<FridgeResponse>(`/api/fridge/${groupId}`),
        enabled: hasGroupFeature(features, 'FRIDGE'),
        staleTime: 30_000,
      },
      {
        queryKey: ['meal-plan', groupId, weekStart],
        queryFn: (): Promise<MealPlanWeek> =>
          api.get<MealPlanWeek>(`/api/meal-plan?groupId=${groupId}&weekStart=${weekStart}`),
        enabled: hasGroupFeature(features, 'RECIPES'),
        staleTime: 30_000,
      },
    ],
  });

  const pendingShopping = (shoppingQ.data ?? []).filter((i) => !i.purchasedAt).length;
  const fridgeCount = fridgeQ.data?.items?.length ?? 0;
  const plannedMeals =
    planQ.data?.entries?.filter((e) => !e.cookedAt).length ?? 0;

  const chips: Array<{ key: string; label: string; route: string }> = [];

  if (hasGroupFeature(features, 'SHOPPING') && shoppingQ.isSuccess) {
    chips.push({
      key: 'shopping',
      label: t('groups.statusShopping', { count: pendingShopping }),
      route: `/(app)/groups/${groupId}/shopping`,
    });
  }
  if (hasGroupFeature(features, 'FRIDGE') && fridgeQ.isSuccess) {
    chips.push({
      key: 'fridge',
      label: t('groups.statusFridge', { count: fridgeCount }),
      route: `/(app)/groups/${groupId}/fridge`,
    });
  }
  if (hasGroupFeature(features, 'RECIPES') && planQ.isSuccess) {
    chips.push({
      key: 'meal-plan',
      label: t('groups.statusMeals', { count: plannedMeals }),
      route: `/(app)/groups/${groupId}/recipes/meal-plan`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
      {chips.map((chip) => (
        <Pressable
          key={chip.key}
          onPress={() => router.push(chip.route as never)}
          className="bg-primary-50 border border-primary-100 rounded-xl px-3 py-2 min-h-[44px] justify-center active:bg-primary-100"
          accessibilityRole="button"
        >
          <Text className="text-sm font-medium text-primary-900">{chip.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
