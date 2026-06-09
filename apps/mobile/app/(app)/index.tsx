import { useCallback, useMemo, useState } from 'react';

import { RefreshControl, Text, View, type LayoutChangeEvent } from 'react-native';
import { VerticalSwipeScroll } from '@/components/VerticalSwipeScroll';

import { Stack } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';

import { Button } from '@/components/Button';

import { LoadingCenter } from '@/components/LoadingCenter';

import { EmptyState } from '@/components/EmptyState';

import { SeasonPreviewStrip } from '@/components/SeasonPreviewStrip';

import { HubIconCarousel, type HubCarouselItem } from '@/components/HubIconCarousel';

import { AdBanner } from '@/components/AdBanner';

import { HubGroupFab } from '@/components/HubGroupFab';
import { HubPersonalModules } from '@/components/HubPersonalModules';
import { HubSection } from '@/components/HubSection';

import { api } from '@/lib/api-client';

import { useHubFavorites } from '@/hooks/useHubFavorites';

import { useCanCreateGroup } from '@/hooks/useCanCreateGroup';




interface GroupListItem {

  id: string;

  name: string;

  description: string | null;

  imageUrl: string | null;

  isPersonal: boolean;

  features?: string[];

  myRole?: 'OWNER' | 'ADMIN' | 'MEMBER';

  _count: { memberships: number };

}



function groupHubIcon(item: GroupListItem): string {

  if (item.isPersonal) return '🏡';

  return '👥';

}



export default function HomeScreen() {

  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const [dockHeight, setDockHeight] = useState(72 + insets.bottom);

  const fabBottom = dockHeight + 12;

  const { canCreateGroup } = useCanCreateGroup();

  const groupFavorites = useHubFavorites('groups');
  const moduleFavorites = useHubFavorites('modules');

  const {

    data: groups,

    isLoading,

    isError,

    error,

    refetch,

    isRefetching,

  } = useQuery<GroupListItem[]>({

    queryKey: ['groups'],

    queryFn: (): Promise<GroupListItem[]> => api.get<GroupListItem[]>('/api/groups'),

    retry: 1,

  });



  const groupItems: HubCarouselItem[] = useMemo(

    () =>

      (groups ?? []).map((g: GroupListItem) => ({

        id: g.id,

        icon: groupHubIcon(g),

        route: `/(app)/groups/${g.id}`,

        accessibilityLabel: g.name,

        subtitle: g.name,

        isPersonal: g.isPersonal,

        imageUrl: g.imageUrl ?? null,

      })),

    [groups],

  );



  const onDockLayout = useCallback((e: LayoutChangeEvent) => {

    setDockHeight(e.nativeEvent.layout.height + 16);

  }, []);



  return (

    <Screen safeBottom={false}>

      <Stack.Screen options={{ headerTitle: t('hub.title'), headerTitleAlign: 'center', headerLeft: () => null }} />



      <VerticalSwipeScroll
        className="flex-1"
        contentContainerStyle={{ paddingBottom: dockHeight + 56, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
      >

        {isLoading ? (
          <HubSection title={t('hub.spacesTitle')}>
            <LoadingCenter />
          </HubSection>
        ) : isError ? (
          <HubSection title={t('hub.spacesTitle')}>
            <View className="gap-3">
              <Text className="text-red-600 text-center text-sm">{t('groups.loadError')}</Text>
              <Text className="text-ink-500 text-center text-xs">
                {error instanceof Error ? error.message : String(error)}
              </Text>
              <Button variant="secondary" onPress={() => refetch()}>
                {t('groups.retry')}
              </Button>
            </View>
          </HubSection>
        ) : groupItems.length === 0 ? (
          <HubSection title={t('hub.spacesTitle')}>
            <EmptyState icon="👥" title={t('groups.emptyTitle')} message={t('groups.empty')} />
          </HubSection>
        ) : (
          <HubIconCarousel
            items={groupItems}
            favoriteIds={groupFavorites.favorites}
            onToggleFavorite={groupFavorites.toggle}
          />
        )}

        <HubPersonalModules
          favoriteIds={moduleFavorites.favorites}
          onToggleFavorite={moduleFavorites.toggle}
        />

      </VerticalSwipeScroll>



      <View

        className="absolute bottom-0 left-0 right-0 bg-ink-50 border-t border-ink-100"

        style={{ paddingBottom: insets.bottom }}

        onLayout={onDockLayout}

      >

        <AdBanner placement="home" />

      </View>



      <HubGroupFab canCreateGroup={canCreateGroup} bottomOffset={fabBottom} />

    </Screen>

  );

}

