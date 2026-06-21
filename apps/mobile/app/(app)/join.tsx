import { Redirect } from 'expo-router';

/** Redirige l'ancienne route authentifiée vers la page publique /join. */
export default function AppJoinRedirect() {
  return <Redirect href="/join" />;
}
