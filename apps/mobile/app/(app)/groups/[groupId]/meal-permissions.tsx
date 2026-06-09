import { useState, useEffect } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import { useMutationError } from '@/hooks/useMutationError';

type MealSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER';
type MealPermission = 'VIEW' | 'EDIT_SLOT' | 'EDIT_ALL';

interface MealPermissionsConfig {
  canManage: boolean;
  settings: {
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    syncTasksToList: boolean;
    allowTaskProposals: boolean;
  };
  members: Array<{
    membershipId: string;
    userId: string;
    role: string;
    displayName: string;
    grants: Array<{ permission: MealPermission; dayOfWeek: number | null; mealSlot: MealSlot | null }>;
    rules: Array<{ dayOfWeek: number; mealSlot: MealSlot | null; createReminder: boolean }>;
  }>;
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const PERMISSIONS: MealPermission[] = ['VIEW', 'EDIT_SLOT', 'EDIT_ALL'];
const SLOTS: MealSlot[] = ['BREAKFAST', 'LUNCH', 'DINNER'];

export default function MealPermissionsScreen() {
  const groupId = useGroupId();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { error, capture, clearError } = useMutationError();

  const { data, isLoading } = useQuery<MealPermissionsConfig>({
    queryKey: ['meal-permissions', groupId],
    queryFn: (): Promise<MealPermissionsConfig> =>
      api.get<MealPermissionsConfig>(`/api/groups/${groupId}/meal-permissions`),
    enabled: !!groupId,
  });

  const [settings, setSettings] = useState<MealPermissionsConfig['settings'] | null>(null);
  const [draftGrants, setDraftGrants] = useState<
    Array<{ membershipId: string; permission: MealPermission; dayOfWeek: number | null; mealSlot: MealSlot | null }>
  >([]);
  const [draftRules, setDraftRules] = useState<
    Array<{ membershipId: string; dayOfWeek: number; mealSlot: MealSlot | null; createReminder: boolean }>
  >([]);

  useEffect(() => {
    if (!data) return;
    setSettings({ ...data.settings });
    setDraftGrants(
      data.members.flatMap((m: MealPermissionsConfig['members'][number]) =>
        m.grants.map((g: MealPermissionsConfig['members'][number]['grants'][number]) => ({
          membershipId: m.membershipId,
          permission: g.permission,
          dayOfWeek: g.dayOfWeek,
          mealSlot: g.mealSlot,
        })),
      ),
    );
    setDraftRules(
      data.members.flatMap((m: MealPermissionsConfig['members'][number]) =>
        m.rules.map((r: MealPermissionsConfig['members'][number]['rules'][number]) => ({
          membershipId: m.membershipId,
          dayOfWeek: r.dayOfWeek,
          mealSlot: r.mealSlot,
          createReminder: r.createReminder,
        })),
      ),
    );
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.put(`/api/groups/${groupId}/meal-permissions`, {
        settings: settings!,
        grants: draftGrants,
        rules: draftRules,
      }),
    onSuccess: () => {
      clearError();
      qc.invalidateQueries({ queryKey: ['meal-permissions', groupId] });
      Alert.alert(t('mealPermissions.savedTitle'), t('mealPermissions.savedMessage'));
    },
    onError: (err) => capture(err),
  });

  function addGrant(membershipId: string) {
    setDraftGrants((prev) => [
      ...prev,
      { membershipId, permission: 'VIEW', dayOfWeek: null, mealSlot: null },
    ]);
  }

  function addRule(membershipId: string) {
    setDraftRules((prev) => [
      ...prev,
      { membershipId, dayOfWeek: 0, mealSlot: 'LUNCH', createReminder: true },
    ]);
  }

  if (!groupId) return null;

  if (isLoading || !data || !settings) {
    return (
      <Screen>
        <LoadingCenter />
      </Screen>
    );
  }

  if (!data.canManage) {
    return (
      <Screen>
        <Text className="text-ink-600">{t('mealPermissions.ownerOnly')}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Text className="text-sm text-ink-600 mb-4">{t('mealPermissions.hint')}</Text>

        <View className="bg-white rounded-2xl p-4 border border-ink-100 mb-4 gap-3">
          <Text className="font-semibold text-ink-900">{t('mealPermissions.settingsTitle')}</Text>
          {(['breakfastTime', 'lunchTime', 'dinnerTime'] as const).map((key) => (
            <View key={key} className="flex-row items-center justify-between">
              <Text className="text-ink-700">{t(`mealPermissions.${key}`)}</Text>
              <TextInput
                value={settings[key]}
                onChangeText={(v) => setSettings((s) => (s ? { ...s, [key]: v } : s))}
                className="border border-ink-200 rounded-lg px-3 py-2 w-24 text-center"
                placeholder="12:30"
              />
            </View>
          ))}
          <View className="flex-row items-center justify-between">
            <Text className="text-ink-700 flex-1 mr-2">{t('mealPermissions.syncTasks')}</Text>
            <Switch
              value={settings.syncTasksToList}
              onValueChange={(v) => setSettings((s) => (s ? { ...s, syncTasksToList: v } : s))}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-ink-700 flex-1 mr-2">{t('mealPermissions.allowProposals')}</Text>
            <Switch
              value={settings.allowTaskProposals}
              onValueChange={(v) => setSettings((s) => (s ? { ...s, allowTaskProposals: v } : s))}
            />
          </View>
        </View>

        {data.members.map((member: MealPermissionsConfig['members'][number]) => (
          <View key={member.membershipId} className="bg-white rounded-2xl p-4 border border-ink-100 mb-4">
            <Text className="font-semibold text-ink-900 mb-1">{member.displayName}</Text>
            <Text className="text-xs text-ink-400 mb-3">{member.role}</Text>

            <Text className="text-sm font-medium text-ink-800 mb-2">{t('mealPermissions.grantsTitle')}</Text>
            {draftGrants
              .map((g, idx) => ({ g, idx }))
              .filter(({ g }) => g.membershipId === member.membershipId)
              .map(({ g, idx }) => (
                <View key={idx} className="mb-2 p-2 bg-ink-50 rounded-lg">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    {PERMISSIONS.map((p) => (
                      <Pressable
                        key={p}
                        onPress={() =>
                          setDraftGrants((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, permission: p } : x)),
                          )
                        }
                        className={`mr-2 px-2 py-1 rounded-full border ${
                          g.permission === p ? 'bg-primary-700 border-primary-700' : 'border-ink-200'
                        }`}
                      >
                        <Text className={`text-xs ${g.permission === p ? 'text-white' : 'text-ink-700'}`}>
                          {t(`mealPermissions.permission.${p}`)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  {g.permission === 'EDIT_SLOT' ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {DAY_KEYS.map((dk, dayIndex) => (
                        <Pressable
                          key={dk}
                          onPress={() =>
                            setDraftGrants((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, dayOfWeek: dayIndex } : x,
                              ),
                            )
                          }
                          className={`mr-1 px-2 py-1 rounded border ${
                            g.dayOfWeek === dayIndex ? 'bg-primary-100 border-primary-300' : 'border-ink-200'
                          }`}
                        >
                          <Text className="text-xs">{t(`mealPlan.days.${dk}`).slice(0, 3)}</Text>
                        </Pressable>
                      ))}
                      {SLOTS.map((slot) => (
                        <Pressable
                          key={slot}
                          onPress={() =>
                            setDraftGrants((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, mealSlot: slot } : x)),
                            )
                          }
                          className={`mr-1 px-2 py-1 rounded border ${
                            g.mealSlot === slot ? 'bg-primary-100 border-primary-300' : 'border-ink-200'
                          }`}
                        >
                          <Text className="text-xs">{t(`mealPlan.slots.${slot}`)}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  ) : null}
                  <Pressable
                    onPress={() => setDraftGrants((prev) => prev.filter((_, i) => i !== idx))}
                    className="mt-2"
                  >
                    <Text className="text-red-600 text-xs">{t('common.delete')}</Text>
                  </Pressable>
                </View>
              ))}
            <Pressable onPress={() => addGrant(member.membershipId)} className="mb-4">
              <Text className="text-primary-700 text-sm">+ {t('mealPermissions.addGrant')}</Text>
            </Pressable>

            <Text className="text-sm font-medium text-ink-800 mb-2">{t('mealPermissions.rulesTitle')}</Text>
            {draftRules
              .map((r, idx) => ({ r, idx }))
              .filter(({ r }) => r.membershipId === member.membershipId)
              .map(({ r, idx }) => (
                <View key={idx} className="mb-2 p-2 bg-ink-50 rounded-lg">
                  <Text className="text-xs text-ink-600 mb-1">
                    {t(`mealPlan.days.${DAY_KEYS[r.dayOfWeek]}`)} ·{' '}
                    {r.mealSlot ? t(`mealPlan.slots.${r.mealSlot}`) : t('mealPermissions.allSlots')}
                  </Text>
                  <Pressable
                    onPress={() => setDraftRules((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    <Text className="text-red-600 text-xs">{t('common.delete')}</Text>
                  </Pressable>
                </View>
              ))}
            <Pressable onPress={() => addRule(member.membershipId)}>
              <Text className="text-primary-700 text-sm">+ {t('mealPermissions.addRule')}</Text>
            </Pressable>
          </View>
        ))}

        {error ? <Text className="text-red-600 text-sm mb-2">{error}</Text> : null}
        <Button onPress={() => saveMutation.mutate()} loading={saveMutation.isPending}>
          {t('common.save')}
        </Button>
      </ScrollView>
    </Screen>
  );
}
