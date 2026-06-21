import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Stack, Link, router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { parseInviteTokenInput } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { InviteGroupCard } from '@/components/InviteGroupCard';
import { AppLogo } from '@/components/AppLogo';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';
import { useInvitePreview } from '@/hooks/useInvitePreview';
import { useSessionStore } from '@/stores/session.store';
import { setPendingInviteToken, clearPendingInviteToken } from '@/lib/pending-invite';
import {
  isStandaloneWebApp,
  openAppStoreForInvite,
  tryOpenNativeInviteApp,
} from '@/lib/invite-open';
import { detectWebPlatform } from '@/hooks/useWebPlatform';

export default function JoinInviteScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ invite?: string }>();
  const inviteFromUrl = Array.isArray(params.invite) ? params.invite[0] : params.invite;

  const [manualToken, setManualToken] = useState('');
  const activeToken =
    (inviteFromUrl?.trim() || parseInviteTokenInput(manualToken)) || undefined;

  const session = useSessionStore((s) => s.session);
  const { error, capture, clearError } = useMutationError();
  const triedNativeOpen = useRef(false);
  const [showWebFallback, setShowWebFallback] = useState(false);

  const { data: preview, isLoading, isError, error: previewError } = useInvitePreview(activeToken);

  useEffect(() => {
    if (inviteFromUrl?.trim()) {
      void setPendingInviteToken(inviteFromUrl.trim());
    }
  }, [inviteFromUrl]);

  useEffect(() => {
    if (!activeToken || triedNativeOpen.current) return;
    if (Platform.OS !== 'web') return;
    if (isStandaloneWebApp()) return;

    const platform = detectWebPlatform();
    if (platform !== 'android' && platform !== 'ios') return;

    triedNativeOpen.current = true;
    tryOpenNativeInviteApp(activeToken);

    const timer = setTimeout(() => setShowWebFallback(true), 2200);
    return () => clearTimeout(timer);
  }, [activeToken]);

  const joinMutation = useMutation({
    mutationFn: (token: string) =>
      api.post<{ group: { id: string } }>('/api/groups/invites/accept', { token }),
    onSuccess: async (membership) => {
      clearError();
      await clearPendingInviteToken();
      router.replace(`/(app)/groups/${membership.group.id}` as never);
    },
    onError: capture,
  });

  function handleJoin() {
    if (!activeToken || preview?.status !== 'valid') return;
    joinMutation.mutate(activeToken);
  }

  function handleLogin() {
    if (activeToken) void setPendingInviteToken(activeToken);
    router.push('/(auth)/login' as never);
  }

  function handleSignup() {
    if (activeToken) void setPendingInviteToken(activeToken);
    router.push('/(auth)/signup' as never);
  }

  const showManualEntry = !inviteFromUrl;
  const canJoin = Boolean(session && preview?.status === 'valid' && activeToken);
  const isMobileWeb = Platform.OS === 'web' && detectWebPlatform() !== 'desktop';

  return (
    <Screen>
      <Stack.Screen options={{ title: t('invite.joinTitle') }} />
      <View className="gap-5 py-2 max-w-lg w-full self-center">
        {!activeToken ? (
          <View className="items-center gap-2 mb-2">
            <AppLogo size={56} />
            <Text className="text-ink-600 text-center">{t('invite.joinHint')}</Text>
          </View>
        ) : null}

        {showManualEntry ? (
          <Input
            label={t('invite.tokenLabel')}
            value={manualToken}
            onChangeText={setManualToken}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}

        {activeToken && isLoading ? <LoadingCenter /> : null}

        {activeToken && isError ? (
          <Text className="text-sm text-red-600 text-center">
            {previewError instanceof Error ? previewError.message : t('invite.previewError')}
          </Text>
        ) : null}

        {preview ? <InviteGroupCard preview={preview} /> : null}

        {isMobileWeb && activeToken && showWebFallback && !isStandaloneWebApp() ? (
          <View className="gap-2">
            <Button variant="secondary" onPress={() => tryOpenNativeInviteApp(activeToken)}>
              {t('invite.openInApp')}
            </Button>
            <Button variant="secondary" onPress={openAppStoreForInvite}>
              {t('invite.downloadApp')}
            </Button>
          </View>
        ) : null}

        {canJoin ? (
          <Button onPress={handleJoin} loading={joinMutation.isPending}>
            {t('invite.joinButton')}
          </Button>
        ) : null}

        {!session && preview?.status === 'valid' ? (
          <View className="gap-2">
            <Text className="text-sm text-ink-600 text-center">{t('invite.loginRequired')}</Text>
            <Button onPress={handleLogin}>{t('auth.loginButton')}</Button>
            <Pressable onPress={handleSignup} className="min-h-[44px] justify-center">
              <Text className="text-center text-primary-700 font-medium">{t('auth.switchToSignup')}</Text>
            </Pressable>
          </View>
        ) : null}

        {error ? <Text className="text-sm text-red-600 text-center">{error}</Text> : null}

        <Link href={session ? '/(app)' : '/(auth)/login'} className="text-center text-sm text-ink-500">
          {t('invite.backHome')}
        </Link>
      </View>
    </Screen>
  );
}
