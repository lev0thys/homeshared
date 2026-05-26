import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

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
      setError(err.message);
      return;
    }
    router.replace('/(app)');
  }

  async function handleGoogle() {
    setError(null);
    // OAuth Google : Supabase ouvre une fenêtre/onglet de consentement.
    // Sur mobile natif, configurer le deep link homeshared:// dans Supabase.
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'homeshared://' },
    });
    if (err) setError(err.message);
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 max-w-md w-full mx-auto">
        <View>
          <Text className="text-3xl font-bold text-ink-900">{t('app.name')}</Text>
          <Text className="text-base text-ink-500 mt-1">{t('app.tagline')}</Text>
        </View>

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
          <Button onPress={handleGoogle} variant="secondary">
            {t('auth.googleSignin')}
          </Button>
        </View>

        <Link href="/(auth)/signup" className="text-center text-primary-700">
          {t('auth.switchToSignup')}
        </Link>
      </View>
    </Screen>
  );
}
