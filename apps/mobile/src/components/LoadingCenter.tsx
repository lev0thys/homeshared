import { ActivityIndicator, View } from 'react-native';

export function LoadingCenter() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
