import { useState } from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  DEFAULT_GROUP_FEATURES,
  hasGroupFeature,
  type GroupFeature,
} from '@homeshared/shared';
import { api } from '@/lib/api-client';
import { useGroupId } from '@/hooks/useGroupId';
import { useGroupRealtime } from '@/hooks/useGroupRealtime';
import { GroupChatPanel } from '@/components/GroupChatPanel';
import { AppHeaderRight, BackHeaderButton, backHeaderScreenOptions } from '@/components/AppHeader';
import { APP_THEME } from '@/lib/theme';

interface GroupMeta {
  id: string;
  name: string;
  features: string[];
  isPersonal: boolean;
}

function tabHref(features: string[], feature: GroupFeature): null | undefined {
  return hasGroupFeature(features, feature) ? undefined : null;
}

const TAB_ICONS: Record<string, string> = {
  index: '🏠',
  shopping: '🛒',
  fridge: '🧊',
  recipes: '🍳',
  tasks: '🧹',
};

export default function GroupTabsLayout() {
  const { t } = useTranslation();
  const groupId = useGroupId();
  const [chatOpen, setChatOpen] = useState(false);

  useGroupRealtime(groupId);

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.get<GroupMeta>(`/api/groups/${groupId}`),
    enabled: !!groupId,
  });

  const features = group?.features ?? DEFAULT_GROUP_FEATURES;
  const showChat = group && !group.isPersonal;

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: APP_THEME.headerBg },
          headerTintColor: APP_THEME.headerFg,
          headerShadowVisible: false,
          headerTitle: group?.name ?? '',
          headerTitleAlign: 'left',
          ...backHeaderScreenOptions({ headerLeft: () => <BackHeaderButton /> }),
          headerRight: () => (
            <AppHeaderRight showChat={!!showChat} onOpenChat={() => setChatOpen(true)} />
          ),
          tabBarActiveTintColor: APP_THEME.tabActive,
          tabBarInactiveTintColor: APP_THEME.tabInactive,
          tabBarStyle: { height: 58, paddingBottom: 6, paddingTop: 4 },
          tabBarLabelStyle: { fontSize: 11, maxWidth: 72 },
          tabBarItemStyle: { paddingHorizontal: 2 },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{TAB_ICONS[route.name] ?? '•'}</Text>
          ),
        })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: t('groups.homeTab') }} />
        <Tabs.Screen
          name="shopping"
          options={{
            tabBarLabel: t('shopping.tab'),
            href: tabHref(features, 'SHOPPING'),
          }}
        />
        <Tabs.Screen
          name="fridge"
          options={{
            tabBarLabel: t('fridge.tab'),
            href: tabHref(features, 'FRIDGE'),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            tabBarLabel: t('recipes.tab'),
            href: tabHref(features, 'RECIPES'),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            tabBarLabel: t('tasks.tab'),
            href: tabHref(features, 'TASKS'),
          }}
        />
        <Tabs.Screen
          name="meal-permissions"
          options={{ href: null, title: t('mealPermissions.title') }}
        />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>

      {groupId && showChat ? (
        <GroupChatPanel groupId={groupId} visible={chatOpen} onClose={() => setChatOpen(false)} />
      ) : null}
    </>
  );
}
