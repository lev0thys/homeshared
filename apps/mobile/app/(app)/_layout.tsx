import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AppHeaderRight, backHeaderScreenOptions } from '@/components/AppHeader';
import { useSessionStore } from '@/stores/session.store';

export default function AppLayout() {
  const { session, isLoading } = useSessionStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        headerTitle: '',
        headerShadowVisible: false,
        headerRight: () => <AppHeaderRight />,
        ...backHeaderScreenOptions(),
      }}
    >
      {/* Un seul bandeau : les layouts enfants (groups, tools) gèrent le header. */}
      <Stack.Screen name="groups" options={{ headerShown: false }} />
      <Stack.Screen name="tools" options={{ headerShown: false }} />
      <Stack.Screen name="create-group" options={{ headerShown: true }} />
      <Stack.Screen name="join" options={{ headerShown: true }} />
    </Stack>
  );
}
