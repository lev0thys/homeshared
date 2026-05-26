import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function GroupTabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#2563eb',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarLabel: 'Accueil' }} />
      <Tabs.Screen name="shopping" options={{ title: t('shopping.title'), tabBarLabel: 'Courses' }} />
      <Tabs.Screen name="fridge" options={{ title: t('fridge.title'), tabBarLabel: 'Frigo' }} />
      <Tabs.Screen name="recipes" options={{ title: t('recipes.title'), tabBarLabel: 'Recettes' }} />
    </Tabs>
  );
}
