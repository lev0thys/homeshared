import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileAvatarPicker } from '@/components/ProfileAvatarPicker';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';
import { GroupFeaturesEditor } from '@/components/GroupFeaturesEditor';

interface GroupProfileEditorProps {
  groupId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPersonal?: boolean;
  features?: string[];
  isOwner?: boolean;
}

/** Écran dédié : image, nom et description de l’espace. */
export function GroupProfileEditor({
  groupId,
  name: initialName,
  description,
  imageUrl: initialImageUrl,
  isPersonal = false,
  features = [],
  isOwner = false,
}: GroupProfileEditorProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();
  const [editName, setEditName] = useState(initialName);
  const [editDescription, setEditDescription] = useState(description ?? '');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(initialImageUrl);

  useEffect(() => {
    setEditName(initialName);
    setEditDescription(description ?? '');
    setEditImageUrl(initialImageUrl);
  }, [initialName, description, initialImageUrl]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.patch(`/api/groups/${groupId}`, {
        name: editName.trim(),
        description: editDescription.trim() || null,
        imageUrl: editImageUrl,
      }),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['group', groupId] });
      qc.invalidateQueries({ queryKey: ['groups'] });
      Alert.alert(t('groups.profileSavedTitle'), t('groups.profileSavedMessage'), [
        { text: t('common.confirm'), onPress: () => router.back() },
      ]);
    },
    onError: (err) => capture(err),
  });

  function handleSave() {
    if (!editName.trim()) {
      Alert.alert(t('groups.nameRequiredTitle'), t('groups.nameRequiredMessage'));
      return;
    }
    saveMutation.mutate();
  }

  return (
    <View className="gap-4">
      <ProfileAvatarPicker
        displayName={editName || initialName}
        avatarUrl={editImageUrl}
        onChange={setEditImageUrl}
      />
      <Input
        label={t('groups.groupName')}
        value={editName}
        onChangeText={setEditName}
        editable={!isPersonal}
        placeholder={t('groups.groupName')}
      />
      {isPersonal ? (
        <Text className="text-xs text-ink-500 -mt-2">{t('groups.personalNameLocked')}</Text>
      ) : null}
      <Input
        label={t('groups.descriptionLabel')}
        value={editDescription}
        onChangeText={setEditDescription}
        placeholder={t('groups.descriptionPlaceholder')}
        multiline
        numberOfLines={4}
      />

      <GroupFeaturesEditor groupId={groupId} features={features} isOwner={isOwner} />

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
      <Button onPress={handleSave} loading={saveMutation.isPending}>
        {t('groups.saveProfile')}
      </Button>
    </View>
  );
}
