import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HorizontalSwipeRow } from '@/components/HorizontalSwipeRow';

interface RecipeNavHubProps {
  groupId: string;
  /** Vue recettes affichée (surlignée, sans rechargement inutile). */
  activeKey?: 'match' | 'mealPlan' | 'discover' | 'catalog';
}

const LINKS = [
  { key: 'match' as const, route: '', icon: '🍳' },
  { key: 'mealPlan' as const, route: '/meal-plan', icon: '📅' },
  { key: 'discover' as const, route: '/discover', icon: '✨' },
  { key: 'catalog' as const, route: 'catalog', icon: '📖' },
];

/**
 * Raccourcis vers les sous-vues recettes (planning, découverte, catalogue global).
 * La vue « match » = suggestions selon le frigo (écran courant).
 */
export function RecipeNavHub({ groupId, activeKey = 'match' }: RecipeNavHubProps) {
  const { t } = useTranslation();

  function navigate(link: (typeof LINKS)[number]) {
    if (link.key === activeKey) return;
    if (link.route === 'catalog') {
      router.push('/(app)/tools/recipes' as never);
      return;
    }
    router.push(`/(app)/groups/${groupId}/recipes${link.route}` as never);
  }

  return (
    <View className="mb-3">
      <HorizontalSwipeRow contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {LINKS.map((link) => {
          const isActive = link.key === activeKey;
          return (
            <Pressable
              key={link.key}
              onPress={() => navigate(link)}
              disabled={isActive}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(`recipes.nav.${link.key}`)}
              className={`flex-row items-center gap-2 px-3.5 py-2 rounded-full border active:opacity-80 ${
                isActive
                  ? 'bg-primary-50 border-primary-300'
                  : 'bg-white border-ink-200'
              }`}
            >
              <Text style={{ fontSize: 18, lineHeight: 20 }}>{link.icon}</Text>
              <Text
                className={`text-xs font-semibold ${isActive ? 'text-primary-800' : 'text-ink-800'}`}
              >
                {t(`recipes.nav.${link.key}`)}
              </Text>
            </Pressable>
          );
        })}
      </HorizontalSwipeRow>
    </View>
  );
}
