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

export default function NewGroupScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (input: CreateGroupInput) => api.post<{ id: string }>('/api/groups', input),
    onSuccess: (group) => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      router.replace(`/(app)/groups/${group.id}`);
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleCreate() {
    const parsed = createGroupSchema.safeParse({
      name,
      description: description.length > 0 ? description : null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Saisie invalide.');
      return;
    }
    setError(null);
    createMutation.mutate(parsed.data);
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: t('groups.newGroup') }} />
      <View className="gap-3 mt-4">
        <Input label={t('groups.groupName')} value={name} onChangeText={setName} />
        <Input
          label={t('groups.groupDescription')}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
        <Button onPress={handleCreate} loading={createMutation.isPending}>
          {t('groups.create')}
        </Button>
      </View>
    </Screen>
  );
}
