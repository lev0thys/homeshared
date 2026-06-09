/**
 * Fallback Metro / TypeScript — n'importe jamais expo-image-picker.
 * Sur web : `pick-avatar-image.web.ts` · sur mobile : `pick-avatar-image.native.ts`
 */
export * from './pick-avatar-image.shared';
export { pickAvatarFromLibrary } from './pick-avatar-image.web';
