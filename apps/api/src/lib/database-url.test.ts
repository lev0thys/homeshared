import { describe, expect, it } from 'vitest';
import { withSupabasePoolLimits } from '../lib/database-url.js';

describe('withSupabasePoolLimits', () => {
  it('ajoute connection_limit=1 sur pooler Supabase', () => {
    const url =
      'postgresql://postgres.x:pass@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?schema=public';
    const out = withSupabasePoolLimits(url);
    expect(out).toContain('connection_limit=1');
  });

  it('ajoute pgbouncer sur port 6543', () => {
    const url =
      'postgresql://postgres.x:pass@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?schema=public';
    const out = withSupabasePoolLimits(url);
    expect(out).toContain('pgbouncer=true');
    expect(out).toContain('connection_limit=1');
  });

  it('ne modifie pas une URL locale', () => {
    const url = 'postgresql://postgres:postgres@localhost:5432/homeshared?schema=public';
    expect(withSupabasePoolLimits(url)).toBe(url);
  });
});
