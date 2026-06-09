import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', '../../packages/shared/src/**/*.test.ts'],
    env: {
      VITEST: 'true',
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public',
      JWT_SECRET: 'test-jwt-secret-with-at-least-32-characters',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    },
  },
});
