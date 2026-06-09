import { Stack } from 'expo-router';
import { AppHeaderRight, backHeaderScreenOptions } from '@/components/AppHeader';
import { APP_THEME } from '@/lib/theme';

export default function ToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: APP_THEME.headerBg },
        headerTintColor: APP_THEME.headerFg,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        headerRight: () => <AppHeaderRight />,
        ...backHeaderScreenOptions(),
      }}
    />
  );
}
