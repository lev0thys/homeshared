import { Stack } from 'expo-router';

/** Masque le header Stack parent (évite l’affichage « groups/[groupId] »). */
export default function GroupsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
