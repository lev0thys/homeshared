import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
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
        headerTitleStyle: { fontWeight: '700' },
      }}
    />
  );
}
