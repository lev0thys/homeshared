import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { LoadingCenter } from '@/components/LoadingCenter';
import { api } from '@/lib/api-client';
import { useMutationError } from '@/hooks/useMutationError';
import { useSessionStore } from '@/stores/session.store';

interface ChatMessage {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; displayName: string; username: string };
}

interface GroupChatPanelProps {
  groupId: string;
  visible: boolean;
  onClose: () => void;
}

export function GroupChatPanel({ groupId, visible, onClose }: GroupChatPanelProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const listRef = useRef<FlatList>(null);
  const [draft, setDraft] = useState('');
  const userId = useSessionStore((s) => s.user?.id);
  const { error, capture, clearError } = useMutationError();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat', groupId],
    queryFn: () => api.get<ChatMessage[]>(`/api/chat/${groupId}`),
    enabled: visible && !!groupId,
    refetchInterval: visible ? 8000 : false,
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => api.post<ChatMessage>('/api/chat', { groupId, body }),
    onSuccess: () => {
      clearError();
      setDraft('');
      qc.invalidateQueries({ queryKey: ['chat', groupId] });
    },
    onError: (err) => capture(err),
  });

  useEffect(() => {
    if (messages?.length && visible) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages?.length, visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-ink-50" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-4 py-3 bg-ink-900">
          <Text className="text-white text-lg font-bold">{t('chat.title')}</Text>
          <Pressable onPress={onClose} className="px-3 py-1">
            <Text className="text-white text-sm">{t('common.back')}</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <LoadingCenter />
        ) : (
          <FlatList
            ref={listRef}
            data={messages ?? []}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 8, flexGrow: 1 }}
            ListEmptyComponent={
              <Text className="text-ink-400 text-center mt-8">{t('chat.empty')}</Text>
            }
            renderItem={({ item }) => {
              const mine = item.author.id === userId;
              return (
                <View className={`mb-3 ${mine ? 'items-end' : 'items-start'}`}>
                  <Text className="text-xs text-ink-400 mb-1">
                    {mine ? t('chat.you') : item.author.displayName}
                  </Text>
                  <View
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      mine ? 'bg-primary-600' : 'bg-white border border-ink-100'
                    }`}
                  >
                    <Text className={mine ? 'text-white' : 'text-ink-900'}>{item.body}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View className="border-t border-ink-200 bg-white p-3 gap-2">
          {error ? <Text className="text-red-600 text-xs">{error}</Text> : null}
          <View className="flex-row gap-2 items-end">
            <View className="flex-1">
              <Input
                placeholder={t('chat.placeholder')}
                value={draft}
                onChangeText={setDraft}
                multiline
              />
            </View>
            <Button
              onPress={() => draft.trim() && sendMutation.mutate(draft.trim())}
              loading={sendMutation.isPending}
              disabled={!draft.trim()}
            >
              {t('chat.send')}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
