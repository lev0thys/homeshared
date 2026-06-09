import { describe, expect, it, beforeEach } from 'vitest';
import {
  clearAuthCache,
  getCachedAuthUserId,
  resolveDisplayName,
  resolveUsername,
  setCachedAuthUserId,
  suggestUsernameFromMetadata,
} from './auth-cache.service.js';

describe('auth-cache.service', () => {
  beforeEach(() => clearAuthCache());

  it('retourne userId en cache', () => {
    setCachedAuthUserId('supa-1', 'local-1');
    expect(getCachedAuthUserId('supa-1')).toBe('local-1');
  });

  it('resolveUsername avec fallback si collision', () => {
    expect(resolveUsername('steve', 'abc-12345', true)).toBe('user_abc-1234');
    expect(resolveUsername('steve', 'abc-12345', false)).toBe('steve');
  });

  it('resolveDisplayName depuis Google metadata', () => {
    expect(resolveDisplayName({ full_name: 'Marie Dupont' }, 'm@x.com')).toBe('Marie Dupont');
    expect(resolveDisplayName(undefined, 'bob@test.com')).toBe('bob');
  });

  it('suggestUsernameFromMetadata depuis email Google', () => {
    expect(suggestUsernameFromMetadata({ full_name: 'Bob' }, 'bob.smith@gmail.com')).toBe(
      'bob_smith',
    );
  });
});
