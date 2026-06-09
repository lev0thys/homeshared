import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { LoadingCenter } from '@/components/LoadingCenter';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import { useMutationError } from '@/hooks/useMutationError';
import { useUserCapabilities } from '@/hooks/useUserCapabilities';
import { useSessionStore } from '@/stores/session.store';
import { MealPlanServingsBar } from '@/components/meal-plan/MealPlanServingsBar';
import { MealSlotVisibilityBar } from '@/components/meal-plan/MealSlotVisibilityBar';
import { MealPlanCalendarView } from '@/components/meal-plan/MealPlanCalendarView';
import { MealPlanListView } from '@/components/meal-plan/MealPlanListView';
import { MealPlanRecipePicker } from '@/components/meal-plan/MealPlanRecipePicker';
import { MealPlanWeekBar } from '@/components/meal-plan/MealPlanWeekBar';
import { RecipeNavHub } from '@/components/recipes/RecipeNavHub';
import { CollapsibleManagePanel } from '@/components/shopping/ShoppingManagePanel';
import { formatServingsLabel } from '@homeshared/shared';
import type { MealPlanWeek, MealSlot, PlanEntry, Suggestions } from '@/components/meal-plan/types';
import { formatWeekRangeLabel, mondayIsoUtc, todayDayIndexUtc } from '@/lib/week-dates';

export default function MealPlanScreen() {
  const groupId = useGroupId();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(() => mondayIsoUtc());
  const highlightDayIndex = weekStart === mondayIsoUtc() ? todayDayIndexUtc() : null;
  const { error: assignError, capture, clearError } = useMutationError();
  const {
    error: shoppingError,
    capture: captureShopping,
    clearError: clearShoppingError,
  } = useMutationError();
  const sessionUserId = useSessionStore((s) => s.user?.id);
  const { canManageShopping } = useUserCapabilities(groupId, sessionUserId);

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [picker, setPicker] = useState<{ day: number; slot: MealSlot } | null>(null);
  const [tab, setTab] = useState<'habits' | 'favorites' | 'proposals' | 'seasonal' | 'discovery'>(
    'proposals',
  );
  const [servingsModal, setServingsModal] = useState(false);
  const [draftAdults, setDraftAdults] = useState('2');
  const [draftChildren, setDraftChildren] = useState('0');
  const [draftFromMembers, setDraftFromMembers] = useState(true);
  const [portionsExpanded, setPortionsExpanded] = useState(false);
  const [optionsExpanded, setOptionsExpanded] = useState(false);

  const { data: plan, isLoading, refetch } = useQuery({
    queryKey: ['meal-plan', groupId, weekStart],
    queryFn: () => api.get<MealPlanWeek>(`/api/meal-plan?groupId=${groupId}&weekStart=${weekStart}`),
    enabled: !!groupId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const settings = plan?.settings;

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['meal-plan-suggestions', groupId, picker?.day, picker?.slot, settings?.effectiveServings],
    queryFn: () =>
      api.get<Suggestions>(
        `/api/meal-plan/suggestions?groupId=${groupId}&dayOfWeek=${picker!.day}&mealSlot=${picker!.slot}&weekStart=${weekStart}`,
      ),
    enabled: !!groupId && picker !== null,
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['meal-plan', groupId] });
    qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
    qc.invalidateQueries({ queryKey: ['fridge', groupId] });
  };

  const plannedMealCount = plan?.entries?.length ?? 0;

  const portionsSummary = settings
    ? `${formatServingsLabel(settings.effectiveServings, settings.adultEaters, settings.childEaters)} · ${
        settings.servingsFromMemberCount
          ? t('mealPlan.portionsFromGroup', { count: settings.memberCount })
          : t('mealPlan.portionsManual')
      }`
    : '';

  const optionsSummary = useMemo(() => {
    if (!settings) return '';
    const locale = i18n.language?.startsWith('en') ? 'en-GB' : 'fr-FR';
    const slots: string[] = [];
    if (settings.showBreakfast) slots.push(t('mealPlan.slots.BREAKFAST'));
    if (settings.showLunch) slots.push(t('mealPlan.slots.LUNCH'));
    if (settings.showDinner) slots.push(t('mealPlan.slots.DINNER'));
    const week = formatWeekRangeLabel(weekStart, locale);
    const meals =
      plannedMealCount > 0
        ? t('mealPlan.plannedMealsCount', { count: plannedMealCount })
        : t('mealPlan.noPlannedMeals');
    return `${week} · ${slots.join(', ') || '—'} · ${meals}`;
  }, [settings, weekStart, plannedMealCount, i18n.language, t]);

  const showShoppingResult = (result: { added: number; updated: number }) => {
    if (result.added === 0 && result.updated === 0) {
      Alert.alert(t('mealPlan.shoppingNothingTitle'), t('mealPlan.shoppingNothingMessage'));
      return;
    }
    Alert.alert(
      t('mealPlan.shoppingAddedTitle'),
      t('mealPlan.shoppingAddedMessage', {
        added: result.added,
        updated: result.updated,
      }),
    );
  };

  const addWeekShoppingMutation = useMutation({
    mutationFn: () =>
      api.post<{ added: number; updated: number; skipped: number }>(
        '/api/meal-plan/shopping-missing',
        { groupId: groupId!, weekStart },
      ),
    onSuccess: (result) => {
      clearShoppingError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      showShoppingResult(result);
    },
    onError: (err) => captureShopping(err),
  });

  const addRecipeShoppingMutation = useMutation({
    mutationFn: (entry: PlanEntry) => {
      const targetServings = entry.servings ?? settings!.effectiveServings;
      return api.post<{ added: number; updated: number }>(
        `/api/recipes/${entry.recipeId}/shopping-missing`,
        { groupId: groupId!, targetServings },
      );
    },
    onSuccess: (result, entry) => {
      clearShoppingError();
      qc.invalidateQueries({ queryKey: ['shopping', groupId] });
      qc.invalidateQueries({ queryKey: ['recipe-fridge-match', entry.recipeId, groupId] });
      qc.invalidateQueries({ queryKey: ['recipes-match', groupId] });
      showShoppingResult(result);
    },
    onError: (err) => captureShopping(err),
  });

  const assignMutation = useMutation({
    mutationFn: (input: { day: number; slot: MealSlot; recipeId: string | null }) =>
      api.put('/api/meal-plan', {
        groupId,
        weekStart,
        dayOfWeek: input.day,
        mealSlot: input.slot,
        recipeId: input.recipeId,
        servings: settings?.effectiveServings,
      }),
    onSuccess: () => {
      clearError();
      invalidateAll();
      setPicker(null);
    },
    onError: (err) => capture(err),
  });

  const completeMutation = useMutation({
    mutationFn: (entryId: string) =>
      api.post<{ consumed: number; partial: string[] }>(`/api/meal-plan/${entryId}/complete`, {}),
    onSuccess: (result: { consumed: number; partial: string[] }) => {
      invalidateAll();
      if (result.partial?.length) {
        Alert.alert(t('mealPlan.completePartialTitle'), t('mealPlan.completePartialMessage'));
      } else {
        Alert.alert(t('mealPlan.completeDoneTitle'), t('mealPlan.completeDoneMessage'));
      }
    },
    onError: (err) => capture(err),
  });

  const settingsMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.patch('/api/meal-plan/week-settings', body),
    onSuccess: () => {
      invalidateAll();
      setServingsModal(false);
    },
    onError: (err) => capture(err),
  });

  const accessMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const s of plan?.slots ?? []) {
      map.set(`${s.dayOfWeek}-${s.mealSlot}`, s.canEdit);
    }
    return map;
  }, [plan?.slots]);

  const entryMap = useMemo(() => {
    const map = new Map<string, PlanEntry>();
    for (const e of plan?.entries ?? []) {
      map.set(`${e.dayOfWeek}-${e.mealSlot}`, e);
    }
    return map;
  }, [plan?.entries]);

  const isOwnerLike = useMemo(() => {
    return [...accessMap.values()].some((v) => v);
  }, [accessMap]);

  function openPicker(day: number, slot: MealSlot) {
    clearError();
    setTab('proposals');
    setPicker({ day, slot });
  }

  function toggleSlotVisibility(slot: MealSlot, value: boolean) {
    if (!groupId || !settings) return;
    const patch = {
      groupId,
      showBreakfast: slot === 'BREAKFAST' ? value : settings.showBreakfast,
      showLunch: slot === 'LUNCH' ? value : settings.showLunch,
      showDinner: slot === 'DINNER' ? value : settings.showDinner,
    };
    settingsMutation.mutate(patch);
  }

  function openServingsModal() {
    if (!settings) return;
    setDraftAdults(String(settings.adultEaters));
    setDraftChildren(String(settings.childEaters));
    setDraftFromMembers(settings.servingsFromMemberCount);
    setServingsModal(true);
  }

  function saveServings() {
    if (!groupId) return;
    settingsMutation.mutate({
      groupId,
      servingsFromMemberCount: draftFromMembers,
      adultEaters: Number.parseInt(draftAdults, 10) || 1,
      childEaters: Number.parseInt(draftChildren, 10) || 0,
    });
  }

  if (!groupId) return null;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('mealPlan.title') }} />

      <RecipeNavHub groupId={groupId} activeKey="mealPlan" />

      <View className="flex-row gap-2 mb-3">
        <Pressable
          onPress={() => setViewMode('calendar')}
          className={`flex-1 py-3 rounded-xl border items-center min-h-[44px] justify-center ${
            viewMode === 'calendar' ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-200'
          }`}
        >
          <Text className={`text-sm font-medium ${viewMode === 'calendar' ? 'text-white' : 'text-ink-700'}`}>
            {t('mealPlan.viewCalendar')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode('list')}
          className={`flex-1 py-3 rounded-xl border items-center min-h-[44px] justify-center ${
            viewMode === 'list' ? 'bg-ink-900 border-ink-900' : 'bg-white border-ink-200'
          }`}
        >
          <Text className={`text-sm font-medium ${viewMode === 'list' ? 'text-white' : 'text-ink-700'}`}>
            {t('mealPlan.viewList')}
          </Text>
        </Pressable>
      </View>

      {isLoading || !settings ? (
        <LoadingCenter />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
          <CollapsibleManagePanel
            expanded={portionsExpanded}
            onToggle={() => setPortionsExpanded((v) => !v)}
            expandLabel={t('mealPlan.expandPortions')}
            collapseLabel={t('mealPlan.collapsePortions')}
            collapsedSummary={portionsSummary}
            showProgressBar={false}
          >
            <MealPlanServingsBar
              settings={settings}
              onAdjust={isOwnerLike ? openServingsModal : undefined}
            />
          </CollapsibleManagePanel>

          <CollapsibleManagePanel
            expanded={optionsExpanded}
            onToggle={() => setOptionsExpanded((v) => !v)}
            expandLabel={t('mealPlan.expandOptions')}
            collapseLabel={t('mealPlan.collapseOptions')}
            collapsedSummary={optionsSummary}
            showProgressBar={false}
          >
            <MealSlotVisibilityBar
              showBreakfast={settings.showBreakfast}
              showLunch={settings.showLunch}
              showDinner={settings.showDinner}
              onToggle={toggleSlotVisibility}
              canEdit={isOwnerLike}
            />

            <MealPlanWeekBar weekStart={weekStart} onWeekStartChange={setWeekStart} />

            {canManageShopping ? (
              <View className="mb-1 gap-1">
                <Button
                  onPress={() => addWeekShoppingMutation.mutate()}
                  loading={addWeekShoppingMutation.isPending}
                  disabled={plannedMealCount === 0 || addRecipeShoppingMutation.isPending}
                >
                  {t('mealPlan.addWeekToShopping')}
                </Button>
                <Text className="text-xs text-ink-500 text-center px-2">
                  {t('mealPlan.addWeekToShoppingHint')}
                </Text>
                {shoppingError ? (
                  <Text className="text-xs text-red-600 text-center">{shoppingError}</Text>
                ) : null}
              </View>
            ) : null}

            <Pressable onPress={() => refetch()} className="py-2">
              <Text className="text-sm text-primary-700 text-center">{t('mealPlan.refreshFridge')}</Text>
            </Pressable>
          </CollapsibleManagePanel>

          {viewMode === 'calendar' ? (
            <MealPlanCalendarView
              settings={settings}
              entryMap={entryMap}
              accessMap={accessMap}
              highlightDayIndex={highlightDayIndex}
              onCellPress={openPicker}
              onComplete={(entry) => completeMutation.mutate(entry.id)}
              canManageShopping={canManageShopping}
              shoppingEntryId={
                addRecipeShoppingMutation.isPending
                  ? addRecipeShoppingMutation.variables?.id ?? null
                  : null
              }
              onAddToShopping={(entry) => addRecipeShoppingMutation.mutate(entry)}
            />
          ) : (
            <MealPlanListView
              settings={settings}
              entryMap={entryMap}
              accessMap={accessMap}
              onSlotPress={openPicker}
              onClearSlot={(day, slot) =>
                assignMutation.mutate({ day, slot, recipeId: null })
              }
              onComplete={(entry) => completeMutation.mutate(entry.id)}
              canManageShopping={canManageShopping}
              shoppingEntryId={
                addRecipeShoppingMutation.isPending
                  ? addRecipeShoppingMutation.variables?.id ?? null
                  : null
              }
              onAddToShopping={(entry) => addRecipeShoppingMutation.mutate(entry)}
            />
          )}
        </ScrollView>
      )}

      <MealPlanRecipePicker
        visible={picker !== null}
        day={picker?.day ?? 0}
        slot={picker?.slot ?? 'LUNCH'}
        tab={tab}
        onTabChange={setTab}
        suggestions={suggestions}
        isLoading={suggestionsLoading}
        isAssigning={assignMutation.isPending}
        assignError={assignError}
        onSelect={(recipeId) => {
          if (!picker) return;
          assignMutation.mutate({ day: picker.day, slot: picker.slot, recipeId });
        }}
        onClear={() => {
          if (!picker) return;
          assignMutation.mutate({ day: picker.day, slot: picker.slot, recipeId: null });
        }}
        onClose={() => setPicker(null)}
      />

      <Modal visible={servingsModal} animationType="fade" transparent>
        <View className="flex-1 justify-center bg-black/40 px-4">
          <View className="bg-white rounded-2xl p-4 gap-3">
            <Text className="text-lg font-bold text-ink-900">{t('mealPlan.portionsAdjustTitle')}</Text>
            <Text className="text-xs text-ink-500">{t('mealPlan.portionsAdjustHint')}</Text>
            <Pressable
              onPress={() => setDraftFromMembers((v) => !v)}
              className="flex-row items-center justify-between py-2"
            >
              <Text className="text-ink-800">{t('mealPlan.portionsFromGroupToggle')}</Text>
              <Text className="font-semibold text-primary-700">
                {draftFromMembers ? t('common.yes') : t('common.no')}
              </Text>
            </Pressable>
            {!draftFromMembers ? (
              <>
                <Input
                  label={t('mealPlan.adultEaters')}
                  value={draftAdults}
                  onChangeText={setDraftAdults}
                  keyboardType="number-pad"
                />
                <Input
                  label={t('mealPlan.childEaters')}
                  value={draftChildren}
                  onChangeText={setDraftChildren}
                  keyboardType="number-pad"
                />
              </>
            ) : (
              <Text className="text-sm text-ink-600">
                {t('mealPlan.portionsFromGroup', { count: settings?.memberCount ?? 0 })}
              </Text>
            )}
            <Button onPress={saveServings} loading={settingsMutation.isPending}>
              {t('common.save')}
            </Button>
            <Button variant="ghost" onPress={() => setServingsModal(false)}>
              {t('common.cancel')}
            </Button>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
