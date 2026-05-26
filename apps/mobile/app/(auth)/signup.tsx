import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { signupSchema } from '@homeshared/shared';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    const parsed = signupSchema.safeParse({ email, password, username, displayName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Saisie invalide.');
      return;
    }

    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName },
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/(app)');
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 max-w-md w-full mx-auto">
        <Text className="text-3xl font-bold text-ink-900">{t('auth.signupTitle')}</Text>

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
          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

          <Button onPress={handleSignup} loading={loading}>
            {t('auth.signupButton')}
          </Button>
        </View>

        <Link href="/(auth)/login" className="text-center text-primary-700">
          {t('auth.switchToLogin')}
        </Link>
      </View>
    </Screen>
  );
}
