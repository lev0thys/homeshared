import * as ImagePicker from 'expo-image-picker';
import {
  dataUriByteLength,
  MAX_AVATAR_BYTES,
  type PickAvatarImageResult,
} from './pick-avatar-image.shared';

export { MAX_AVATAR_BYTES, type PickAvatarImageResult };

/** Choisir une photo depuis la bibliothèque (iOS / Android). */
export async function pickAvatarFromLibrary(): Promise<PickAvatarImageResult> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return '__PERMISSION_DENIED__';
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.65,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  if (!asset.base64) {
    return null;
  }

  const mime = asset.mimeType ?? 'image/jpeg';
  const dataUri = `data:${mime};base64,${asset.base64}`;

  if (dataUriByteLength(dataUri) > MAX_AVATAR_BYTES) {
    return '__TOO_LARGE__';
  }

  return dataUri;
}
