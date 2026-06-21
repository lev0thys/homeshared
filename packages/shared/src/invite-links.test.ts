import { describe, expect, it } from 'vitest';
import {
  buildAndroidInviteIntentUrl,
  buildInviteAppDeepLink,
  buildInviteWebUrl,
  buildPlayStoreUrl,
  parseInviteTokenInput,
} from './invite-links.js';

describe('invite-links', () => {
  it('buildInviteWebUrl encode le token', () => {
    const url = buildInviteWebUrl('https://homeshared.vercel.app/', 'abc+def');
    expect(url).toBe('https://homeshared.vercel.app/join?invite=abc%2Bdef');
  });

  it('buildInviteAppDeepLink utilise le scheme homeshared', () => {
    expect(buildInviteAppDeepLink('tok123')).toBe('homeshared://join?invite=tok123');
  });

  it('buildPlayStoreUrl fallback package Android', () => {
    expect(buildPlayStoreUrl()).toContain('com.steve.homeshared');
  });

  it('buildAndroidInviteIntentUrl inclut fallback Play Store', () => {
    const intent = buildAndroidInviteIntentUrl('tok', 'https://play.example/app');
    expect(intent).toContain('intent://join?invite=tok');
    expect(intent).toContain('com.steve.homeshared');
    expect(intent).toContain(encodeURIComponent('https://play.example/app'));
  });

  it('parseInviteTokenInput extrait invite depuis URL', () => {
    expect(parseInviteTokenInput('https://homeshared.vercel.app/join?invite=abc123')).toBe('abc123');
    expect(parseInviteTokenInput('rawcode')).toBe('rawcode');
  });
});
