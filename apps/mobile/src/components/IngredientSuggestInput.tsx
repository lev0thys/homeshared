import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Input } from '@/components/Input';

interface IngredientHit {
  slug: string;
  nameFr: string;
  aliases: string[];
}

interface Props {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  onSelectSuggestion?: (name: string) => void;
}

/** Saisie avec suggestions depuis le catalogue d'ingrédients (aliases FR). */
export function IngredientSuggestInput({
  label,
  placeholder,
  value,
  onChangeText,
  onSelectSuggestion,
}: Props) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value.trim()), 250);
    return () => clearTimeout(t);
  }, [value]);

  const { data: suggestions } = useQuery({
    queryKey: ['ingredients', debounced],
    queryFn: () =>
      api.get<IngredientHit[]>(`/api/ingredients?q=${encodeURIComponent(debounced)}&limit=8`),
    enabled: debounced.length >= 2,
  });

  const showList = debounced.length >= 2 && (suggestions?.length ?? 0) > 0;

  return (
    <View>
      <Input label={label} placeholder={placeholder} value={value} onChangeText={onChangeText} />
      {showList ? (
        <View className="mt-1 bg-white border border-ink-100 rounded-xl overflow-hidden max-h-40">
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(i) => i.slug}
            renderItem={({ item }) => (
              <Pressable
                className="px-3 py-2 border-b border-ink-50 active:bg-ink-50"
                onPress={() => {
                  onChangeText(item.nameFr);
                  onSelectSuggestion?.(item.nameFr);
                }}
              >
                <Text className="text-ink-900">{item.nameFr}</Text>
                {item.aliases.length > 0 ? (
                  <Text className="text-xs text-ink-400" numberOfLines={1}>
                    {item.aliases.slice(0, 3).join(', ')}
                  </Text>
                ) : null}
              </Pressable>
            )}
          />
        </View>
      ) : null}
    </View>
  );
}
