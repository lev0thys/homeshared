/** Taille max fichier / data-URI (~120 Ko brut). */
export const MAX_AVATAR_BYTES = 120_000;

export type PickAvatarImageResult = string | null | '__TOO_LARGE__' | '__PERMISSION_DENIED__';

export function dataUriByteLength(dataUri: string): number {
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1]! : dataUri;
  return Math.ceil((base64.length * 3) / 4);
}
