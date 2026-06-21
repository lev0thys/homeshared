import { env } from './env';

/** Accès au mode magasin sans filtre données (essais / QA). */
export function isStoreModeDevEnabled(): boolean {
  return __DEV__ || env.STORE_MODE_DEV;
}
