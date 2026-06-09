import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface RecipeStepperProps {
  steps: string[];
}

export function RecipeStepper({ steps }: RecipeStepperProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const total = steps.length;

  if (total === 0) {
    return <Text className="text-ink-500">{t('recipes.noSteps')}</Text>;
  }

  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-primary-700">
          {t('recipes.stepProgress', { current: current + 1, total })}
        </Text>
        <Text className="text-xs text-ink-400">{Math.round(((current + 1) / total) * 100)}%</Text>
      </View>

      <View className="flex-row gap-1 flex-wrap">
        {steps.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setCurrent(i)}
            accessibilityRole="button"
            accessibilityLabel={t('recipes.stepLabel', { number: i + 1 })}
            className={`h-3 rounded-full ${i <= current ? 'bg-primary-600' : 'bg-ink-200'} ${
              i === current ? 'w-8' : 'w-3'
            }`}
          />
        ))}
      </View>

      <View className="bg-white border border-ink-100 rounded-2xl p-5 min-h-[160px] justify-center shadow-sm">
        <Text className="text-xs text-ink-400 mb-2 uppercase tracking-wide">
          {t('recipes.stepLabel', { number: current + 1 })}
        </Text>
        <Text className="text-lg text-ink-900 leading-7">{step}</Text>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Pressable
            onPress={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={isFirst}
            className={`rounded-xl py-4 items-center border min-h-[48px] justify-center ${
              isFirst ? 'border-ink-100 bg-ink-50' : 'border-ink-200 bg-white active:bg-ink-50'
            }`}
          >
            <Text className={`font-semibold ${isFirst ? 'text-ink-300' : 'text-ink-800'}`}>
              ← {t('recipes.prevStep')}
            </Text>
          </Pressable>
        </View>
        <View className="flex-1">
          <Pressable
            onPress={() => {
              if (isLast) setCurrent(0);
              else setCurrent((c) => Math.min(total - 1, c + 1));
            }}
            className={`rounded-xl py-4 items-center min-h-[48px] justify-center ${
              isLast ? 'bg-emerald-600 active:bg-emerald-700' : 'bg-primary-600 active:bg-primary-700'
            }`}
          >
            <Text className="font-semibold text-white">
              {isLast ? t('recipes.restart') : `${t('recipes.nextStep')} →`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
