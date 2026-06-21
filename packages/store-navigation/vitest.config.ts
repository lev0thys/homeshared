import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@homeshared/shared': resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
