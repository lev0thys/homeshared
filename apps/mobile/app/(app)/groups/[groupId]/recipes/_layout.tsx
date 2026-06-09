import { Stack } from 'expo-router';

/** Stack recettes : pas de 2ᵉ barre (onglets groupe en bas). */
export default function RecipesStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
