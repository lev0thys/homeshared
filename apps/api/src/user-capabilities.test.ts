import { describe, expect, it } from 'vitest';
import { buildUserCapabilities, resolveIsChildUser } from '@homeshared/shared';

describe('resolveIsChildUser', () => {
  it('combine compte et membership', () => {
    expect(resolveIsChildUser({ isChild: true }, { isChild: false })).toBe(true);
    expect(resolveIsChildUser({ isChild: false }, { isChild: true })).toBe(true);
    expect(resolveIsChildUser({ isChild: false }, { isChild: false })).toBe(false);
  });
});

describe('buildUserCapabilities', () => {
  it('restreint les actions pour un enfant', () => {
    const caps = buildUserCapabilities({ isChild: true, isGroupOwner: false });
    expect(caps.canCreateGroup).toBe(false);
    expect(caps.canManageShopping).toBe(false);
  });
});
