import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useSessionStore } from '@/stores/session.store';

export default function Index() {
  const { session, isLoading } = useSessionStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50">
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={session ? '/(app)' : '/(auth)/login'} />;
}
