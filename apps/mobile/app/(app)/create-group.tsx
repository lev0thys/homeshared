import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroupSchema, type CreateGroupInput } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';

export default function CreateGroupScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { error, capture, clearError } = useMutationError();

  const createMutation = useMutation({
    mutationFn: (input: CreateGroupInput) => api.post<{ id: string }>('/api/groups', input),
    onSuccess: (group) => {
      clearError();
      qc.invalidateQueries({ queryKey: ['groups'] });
      router.replace(`/(app)/groups/${group.id}`);
    },
    onError: (err) => capture(err),
  });

  function handleCreate() {
    const parsed = createGroupSchema.safeParse({
      name,
      description: description.length > 0 ? description : null,
    });
    if (!parsed.success) {
      capture(new Error(parsed.error.issues[0]?.message ?? 'Saisie invalide.'));
      return;
    }
    clearError();
    createMutation.mutate(parsed.data);
  }

  return (
    <Screen keyboard>
      <Stack.Screen options={{ title: t('groups.newGroup') }} />
      <View className="gap-3 mt-1 max-w-md w-full self-center">
        <Input label={t('groups.groupName')} value={name} onChangeText={setName} />
        <Input
          label={t('groups.groupDescription')}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
        <Button onPress={handleCreate} loading={createMutation.isPending} disabled={!name.trim()}>
          {t('groups.create')}
        </Button>
      </View>
    </Screen>
  );
}
