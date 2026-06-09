import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';

export default function JoinGroupScreen() {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const { error, capture, clearError } = useMutationError();

  const joinMutation = useMutation({
    mutationFn: () =>
      api.post<{ group: { id: string } }>('/api/groups/invites/accept', { token: token.trim() }),
    onSuccess: (membership) => {
      clearError();
      router.replace(`/(app)/groups/${membership.group.id}`);
    },
    onError: capture,
  });

  return (
    <Screen>
      <Stack.Screen options={{ title: t('invite.joinTitle') }} />
      <View className="gap-4 mt-1">
        <Text className="text-ink-600">{t('invite.joinHint')}</Text>
        <Input
          label={t('invite.tokenLabel')}
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
        <Button onPress={() => joinMutation.mutate(undefined)} loading={joinMutation.isPending} disabled={!token.trim()}>
          {t('invite.joinButton')}
        </Button>
      </View>
    </Screen>
  );
}
