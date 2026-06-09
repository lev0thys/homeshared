/** Avatars prédéfinis (emoji sur fond coloré). Stockés en `emoji:🦊` dans avatarUrl. */
export const AVATAR_PRESETS: Array<{ id: string; emoji: string; bg: string }> = [
  { id: 'chef', emoji: '👨‍🍳', bg: '#fef3c7' },
  { id: 'cook', emoji: '👩‍🍳', bg: '#fce7f3' },
  { id: 'fox', emoji: '🦊', bg: '#ffedd5' },
  { id: 'bear', emoji: '🐻', bg: '#e0e7ff' },
  { id: 'cat', emoji: '🐱', bg: '#ecfccb' },
  { id: 'dog', emoji: '🐶', bg: '#cffafe' },
  { id: 'rabbit', emoji: '🐰', bg: '#fae8ff' },
  { id: 'panda', emoji: '🐼', bg: '#f1f5f9' },
  { id: 'lion', emoji: '🦁', bg: '#fef9c3' },
  { id: 'frog', emoji: '🐸', bg: '#d1fae5' },
  { id: 'owl', emoji: '🦉', bg: '#ede9fe' },
  { id: 'star', emoji: '⭐', bg: '#fff7ed' },
];

export function presetAvatarValue(emoji: string): string {
  return `emoji:${emoji}`;
}

export function parsePresetEmoji(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl?.startsWith('emoji:')) return null;
  return avatarUrl.slice('emoji:'.length) || null;
}
