import { ScrollView, Text, View } from 'react-native';
import { Stack, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';

const SECTIONS_FR = [
  {
    title: '1. Responsable du traitement',
    body: 'L\'application homeshared est éditée par Steve (contact : via le dépôt GitHub du projet). Cette politique décrit comment vos données sont collectées et utilisées.',
  },
  {
    title: '2. Données collectées',
    body: 'Compte : email, nom d\'affichage, identifiant, photo de profil optionnelle. Contenu collaboratif : listes de courses, frigo, recettes planifiées, tâches et messages de groupe que vous créez. Données techniques : identifiants de session, logs serveur limités.',
  },
  {
    title: '3. Finalités',
    body: 'Fournir le service collaboratif (partage au sein de vos groupes), authentification, amélioration du produit et, le cas échéant, affichage de publicités non personnalisées ou personnalisées selon votre consentement.',
  },
  {
    title: '4. Hébergement et sous-traitants',
    body: 'Données hébergées via Supabase (PostgreSQL, authentification) et l\'API homeshared. Publicités : Google AdMob (Google Ireland Limited). Les prestataires sont choisis pour leur conformité RGPD.',
  },
  {
    title: '5. Durée de conservation',
    body: 'Vos données sont conservées tant que votre compte est actif. Après suppression du compte, les données personnelles sont effacées sous 30 jours (sauf obligation légale de conservation).',
  },
  {
    title: '6. Vos droits',
    body: 'Accès, rectification, suppression, opposition et portabilité : contactez-nous ou supprimez votre compte depuis Profil → Supprimer mon compte. Réclamation possible auprès de la CNIL (cnil.fr).',
  },
  {
    title: '7. Publicités et consentement',
    body: 'Des bannières publicitaires peuvent s\'afficher. En Union européenne, un bandeau de consentement (UMP Google) vous permet d\'accepter ou refuser la personnalisation. Vous pouvez rouvrir les préférences depuis votre profil.',
  },
  {
    title: '8. Mises à jour',
    body: 'Cette politique peut évoluer. La date de dernière mise à jour est indiquée ci-dessous. L\'utilisation continue du service vaut acceptation des modifications substantielles.',
  },
] as const;

const SECTIONS_EN = [
  {
    title: '1. Data controller',
    body: 'homeshared is published by Steve (contact via the project GitHub repository). This policy explains how your data is collected and used.',
  },
  {
    title: '2. Data collected',
    body: 'Account: email, display name, identifier, optional profile photo. Collaborative content: shopping lists, fridge, meal plans, tasks and group messages you create. Technical data: session identifiers, limited server logs.',
  },
  {
    title: '3. Purposes',
    body: 'Provide the collaborative service within your groups, authentication, product improvement and, where applicable, display of non-personalized or personalized ads depending on your consent.',
  },
  {
    title: '4. Hosting and processors',
    body: 'Data hosted via Supabase (PostgreSQL, authentication) and the homeshared API. Ads: Google AdMob (Google Ireland Limited). Processors are selected for GDPR compliance.',
  },
  {
    title: '5. Retention',
    body: 'Your data is kept while your account is active. After account deletion, personal data is erased within 30 days (except where legal retention applies).',
  },
  {
    title: '6. Your rights',
    body: 'Access, rectification, deletion, objection and portability: contact us or delete your account from Profile → Delete my account. You may lodge a complaint with your local supervisory authority.',
  },
  {
    title: '7. Ads and consent',
    body: 'Banner ads may be displayed. In the EU, a Google UMP consent form lets you accept or refuse personalization. You can reopen preferences from your profile.',
  },
  {
    title: '8. Updates',
    body: 'This policy may change. The last update date is shown below. Continued use of the service constitutes acceptance of material changes.',
  },
] as const;

export default function PrivacyScreen() {
  const { t, i18n } = useTranslation();
  const sections = i18n.language.startsWith('en') ? SECTIONS_EN : SECTIONS_FR;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('legal.privacyTitle') }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="gap-4 max-w-2xl w-full self-center">
        <Text className="text-2xl font-bold text-ink-900">{t('legal.privacyTitle')}</Text>
        <Text className="text-xs text-ink-500">{t('legal.lastUpdated', { date: '2026-05-28' })}</Text>

        {sections.map((section) => (
          <View key={section.title} className="bg-white rounded-2xl p-4 border border-ink-100 gap-2">
            <Text className="text-base font-semibold text-ink-900">{section.title}</Text>
            <Text className="text-sm text-ink-700 leading-6">{section.body}</Text>
          </View>
        ))}

        <Link href="/(auth)/login" className="text-center text-primary-700 text-sm">
          {t('legal.backToApp')}
        </Link>
      </ScrollView>
    </Screen>
  );
}
