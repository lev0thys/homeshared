import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HomesharedLogoMark } from '@/components/HomesharedLogoMark';

const PRESET_PX = { sm: 36, md: 42, lg: 56, xl: 72 } as const;

interface HomesharedLogoProps {
  /** Presets header (sm), auth (lg), download (xl). */
  size?: keyof typeof PRESET_PX;
  /** Taille exacte en px — prioritaire sur `size`. */
  pixelSize?: number;
  onPress?: () => void;
  /** false = image seule (login, download). */
  interactive?: boolean;
  /** Header sombre (#0f172a) vs fond clair. */
  tone?: 'onDark' | 'onLight';
  /** Zone tactile 44pt même pour un picto petit (header). */
  hitSlop?: boolean;
}

/** Logo homeshared — maison + lien, fond transparent, lisible en header. */
export function HomesharedLogo({
  size = 'md',
  pixelSize,
  onPress,
  interactive = true,
  tone = 'onDark',
  hitSlop = true,
}: HomesharedLogoProps) {
  const { t } = useTranslation();
  const px = pixelSize ?? PRESET_PX[size];

  const mark = <HomesharedLogoMark size={px} tone={tone} />;

  if (!interactive) {
    return mark;
  }

  return (
    <Pressable
      onPress={onPress ?? (() => router.push('/(app)' as never))}
      accessibilityRole="button"
      accessibilityLabel={t('hub.logoA11y')}
      className={
        hitSlop ? 'min-h-[44px] min-w-[44px] items-center justify-center' : 'items-center justify-center'
      }
    >
      {mark}
    </Pressable>
  );
}
