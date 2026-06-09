import {
  MAX_AVATAR_BYTES,
  type PickAvatarImageResult,
} from './pick-avatar-image.shared';

export { MAX_AVATAR_BYTES, type PickAvatarImageResult };

/** Choisir une photo via le sélecteur de fichiers du navigateur. */
export async function pickAvatarFromLibrary(): Promise<PickAvatarImageResult> {
  if (typeof document === 'undefined') return null;

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      if (file.size > MAX_AVATAR_BYTES) {
        resolve('__TOO_LARGE__');
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
