import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { hasGroupFeature } from '@homeshared/shared';
import { showAdsPrivacyOptions } from '@tech-bricks/ads';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { ProfileAvatarPicker } from '@/components/ProfileAvatarPicker';
import { api, ApiClientError } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isChild: boolean;
  createdAt: string;
  _count: { memberships: number; recipeFavorites: number };
}

interface GroupListItem {
  id: string;
  name: string;
  isPersonal: boolean;
  features: string[];
  myRole?: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<UserProfile>('/api/users/me'),
  });

  const { data: groups } = useQuery<GroupListItem[]>({
    queryKey: ['groups'],
    queryFn: (): Promise<GroupListItem[]> => api.get<GroupListItem[]>('/api/groups'),
  });

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

  const ownedGroups = (groups ?? []).filter(
    (g: GroupListItem) => g.myRole === 'OWNER' && !g.isPersonal,
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      api.patch('/api/users/me', {
        displayName: displayName.trim(),
        bio: bio.trim() || null,
        avatarUrl,
      }),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: ['groups'] });
      Alert.alert(t('profile.savedTitle'), t('profile.savedMessage'));
    },
    onError: (err) => capture(err),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete('/api/users/me'),
    onSuccess: () => {
      void supabase.auth.signOut().then(() => router.replace('/(auth)/login'));
    },
    onError: (err) => {
      const message =
        err instanceof ApiClientError ? err.body.message : t('profile.deleteAccountError');
      Alert.alert(t('profile.deleteAccountTitle'), message);
    },
  });

  function confirmDeleteAccount() {
    Alert.alert(t('profile.deleteAccountTitle'), t('profile.deleteAccountMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.deleteAccountConfirm'),
        style: 'destructive',
        onPress: () => deleteMutation.mutate(undefined),
      },
    ]);
  }

  function openPrivacyPolicy() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open('/privacy', '_blank');
      return;
    }
    router.push('/privacy' as never);
  }

  async function openAdsPreferences() {
    const granted = await showAdsPrivacyOptions();
    if (!granted && Platform.OS === 'android') {
      Alert.alert(t('legal.adsPreferencesTitle'), t('legal.adsPreferencesUnavailable'));
    }
  }

  return (
    <Screen keyboard>
      <Stack.Screen options={{ title: t('profile.title') }} />
      {isLoading || !profile ? (
        <LoadingCenter />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="gap-4">
          <ProfileAvatarPicker
            displayName={displayName || profile.displayName}
            avatarUrl={avatarUrl}
            onChange={setAvatarUrl}
          />

          <View className="items-center">
            <Text className="text-xl font-bold text-ink-900 mt-2">{profile.displayName}</Text>
            <Text className="text-sm text-ink-500">@{profile.username}</Text>
            {profile.isChild ? (
              <Text className="text-xs text-amber-700 font-medium mt-1">{t('childMode.badge')}</Text>
            ) : null}
          </View>

          <View className="flex-row gap-3 max-w-md w-full self-center">
            <View className="flex-1 bg-white rounded-2xl p-3 border border-ink-100 items-center">
              <Text className="text-2xl font-bold text-primary-700">{profile._count.memberships}</Text>
              <Text className="text-xs text-ink-500">{t('profile.groups')}</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-3 border border-ink-100 items-center">
              <Text className="text-2xl font-bold text-primary-700">
                {profile._count.recipeFavorites}
              </Text>
              <Text className="text-xs text-ink-500">{t('profile.favorites')}</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 border border-ink-100 gap-3 max-w-md w-full self-center">
            <Text className="text-sm font-semibold text-ink-700">{t('profile.editTitle')}</Text>
            <Input label={t('auth.displayName')} value={displayName} onChangeText={setDisplayName} />
            <Input
              label={t('profile.bio')}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              placeholder={t('profile.bioPlaceholder')}
            />
            <Button onPress={() => saveMutation.mutate(undefined)} loading={saveMutation.isPending}>
              {t('common.save')}
            </Button>
            {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
          </View>

          {!profile.isChild && ownedGroups.length > 0 ? (
            <View className="bg-white rounded-2xl p-4 border border-ink-100 gap-3 max-w-md w-full self-center">
              <Text className="text-base font-semibold text-ink-900">{t('profile.ownedGroupsTitle')}</Text>
              <Text className="text-xs text-ink-500">{t('profile.ownedGroupsHint')}</Text>
              {ownedGroups.map((g: GroupListItem) => (
                <View key={g.id} className="border border-ink-100 rounded-xl p-3 gap-2">
                  <Text className="font-semibold text-ink-900">{g.name}</Text>
                  {hasGroupFeature(g.features, 'RECIPES') ? (
                    <Pressable
                      onPress={() =>
                        router.push(`/(app)/groups/${g.id}/meal-permissions` as never)
                      }
                      className="bg-primary-50 border border-primary-200 rounded-xl px-3 py-3 min-h-[44px] justify-center active:bg-primary-100"
                    >
                      <Text className="text-sm font-medium text-primary-800">
                        {t('profile.manageMealPermissions')}
                      </Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={() => router.push(`/(app)/groups/${g.id}` as never)}
                    className="bg-ink-50 border border-ink-100 rounded-xl px-3 py-3 min-h-[44px] justify-center active:bg-ink-100"
                  >
                    <Text className="text-sm font-medium text-ink-700">{t('profile.manageMembers')}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}

          <View className="max-w-md w-full self-center gap-3">
            <View className="bg-white rounded-2xl p-4 border border-ink-100 gap-3">
              <Text className="text-sm font-semibold text-ink-700">{t('legal.sectionTitle')}</Text>
              <Pressable
                onPress={openPrivacyPolicy}
                className="min-h-[44px] justify-center active:opacity-70"
              >
                <Text className="text-sm text-primary-700">{t('legal.privacyLink')}</Text>
              </Pressable>
              {Platform.OS === 'android' ? (
                <Pressable
                  onPress={() => void openAdsPreferences()}
                  className="min-h-[44px] justify-center active:opacity-70"
                >
                  <Text className="text-sm text-primary-700">{t('legal.adsPreferencesLink')}</Text>
                </Pressable>
              ) : null}
            </View>

            <Button
              variant="ghost"
              onPress={() => supabase.auth.signOut().then(() => router.replace('/(auth)/login'))}
            >
              {t('auth.logout')}
            </Button>

            <View className="bg-red-50 rounded-2xl p-4 border border-red-100 gap-3">
              <Text className="text-sm font-semibold text-red-800">{t('profile.deleteAccountTitle')}</Text>
              <Text className="text-xs text-red-700">{t('profile.deleteAccountHint')}</Text>
              <Button
                variant="ghost"
                onPress={confirmDeleteAccount}
                loading={deleteMutation.isPending}
              >
                {t('profile.deleteAccountConfirm')}
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
