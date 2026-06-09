import { useState } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { signInWithGoogle } from '@/lib/google-auth';
import { formatAuthError } from '@/lib/auth-errors';

interface GoogleAuthButtonProps {
  onError?: (message: string | null) => void;
}

export function GoogleAuthButton({ onError }: GoogleAuthButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    onError?.(null);
    try {
      const result = await signInWithGoogle();
      if (!result.ok) {
        onError?.(formatAuthError({ message: result.message }));
        return;
      }
      if (result.redirecting && Platform.OS === 'web') {
        return;
      }
      router.replace('/(app)');
    } catch (e) {
      onError?.(formatAuthError({ message: e instanceof Error ? e.message : 'Erreur réseau' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onPress={handleGoogle} variant="secondary" loading={loading}>
      {t('auth.googleSignin')}
    </Button>
  );
}
