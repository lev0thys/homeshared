import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { signupSchema } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { signUpWithEmail } from '@/lib/auth';
import { formatAuthError } from '@/lib/auth-errors';
import { DevConfigWarning } from '@/components/DevConfigWarning';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { DownloadBanner } from '@/components/DownloadBanner';
import { AppLogo } from '@/components/AppLogo';

export default function SignupScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isChildAccount, setIsChildAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    const parsed = signupSchema.safeParse({ email, password, username, displayName, isChild: isChildAccount });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Saisie invalide.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await signUpWithEmail(parsed.data);
      if (!result.ok) {
        setError(formatAuthError({ message: result.message }));
        return;
      }
      router.replace('/(app)');
    } catch (e) {
      setError(formatAuthError({ message: e instanceof Error ? e.message : 'Erreur réseau' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 max-w-md w-full mx-auto">
        <View className="items-center gap-2">
          <AppLogo size={56} />
          <Text className="text-3xl font-bold text-ink-900">{t('auth.signupTitle')}</Text>
        </View>
        <DevConfigWarning />
        <DownloadBanner />

        <View className="gap-3">
          <Input label={t('auth.displayName')} value={displayName} onChangeText={setDisplayName} />
          <Input
            label={t('auth.username')}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View className="flex-row items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-3 py-3">
            <View className="flex-1 mr-3">
              <Text className="text-sm font-medium text-ink-900">{t('auth.childAccount')}</Text>
              <Text className="text-xs text-ink-500 mt-1">{t('auth.childAccountHint')}</Text>
            </View>
            <Switch value={isChildAccount} onValueChange={setIsChildAccount} />
          </View>
          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

          <Button onPress={handleSignup} loading={loading}>
            {t('auth.signupButton')}
          </Button>
          <GoogleAuthButton onError={setError} />
        </View>

        <Link href="/(auth)/login" className="text-center text-primary-700">
          {t('auth.switchToLogin')}
        </Link>

        <Text className="text-center text-xs text-ink-500">
          {t('legal.privacySignupHint')}{' '}
          <Link href="/privacy" className="text-primary-700 underline">
            {t('legal.privacyLink')}
          </Link>
        </Text>
      </View>
    </Screen>
  );
}
