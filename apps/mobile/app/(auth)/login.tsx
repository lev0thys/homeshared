import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { redirectAfterAuth } from '@/lib/post-auth-redirect';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { formatAuthError } from '@/lib/auth-errors';
import { DevConfigWarning } from '@/components/DevConfigWarning';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { DownloadBanner } from '@/components/DownloadBanner';
import { AppLogo } from '@/components/AppLogo';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(formatAuthError(err));
      return;
    }
    await redirectAfterAuth();
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 max-w-md w-full mx-auto">
        <View className="items-center gap-2">
          <AppLogo size={64} />
          <Text className="text-3xl font-bold text-ink-900">{t('app.name')}</Text>
          <Text className="text-base text-ink-500 mt-1 text-center">{t('app.tagline')}</Text>
        </View>
        <DevConfigWarning />

        <DownloadBanner />

        <View className="gap-3">
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
          />
          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

          <Button onPress={handleLogin} loading={loading}>
            {t('auth.loginButton')}
          </Button>
          <GoogleAuthButton onError={setError} />
        </View>

        <Link href="/(auth)/signup" className="text-center text-primary-700">
          {t('auth.switchToSignup')}
        </Link>
        <Link href="/download" className="text-center text-sm text-ink-500">
          {t('download.title')} →
        </Link>
      </View>
    </Screen>
  );
}
