# Sync temps réel (Supabase Realtime)

homeshared invalide automatiquement les listes courses, frigo, planning et tâches quand un autre membre modifie les données (`useGroupRealtime` dans le layout groupe).

## Prérequis dashboard Supabase

1. **Database → Replication** (ou **Publications** selon l'UI Supabase)
2. Activer Realtime sur les tables :
   - `ShoppingItem`
   - `FridgeItem`
   - `MealPlanEntry`
   - `HouseholdTask`
   - `GroupMessage`
3. Vérifier que la publication `supabase_realtime` inclut ces tables.

## RLS (obligatoire en prod)

Sans RLS, **toute la base est accessible** via la clé anon (alertes Supabase **CRITICAL**).

1. Exécuter **`supabase/rls/001_enable_rls.sql`** — Supabase → SQL Editor → Run
2. Lire **`docs/SECURITY-RLS-SUPABASE.md`** — guide et vérification

> L'API Fly (Prisma, rôle postgres) bypass RLS. RLS protège PostgREST + Realtime.

## Test manuel

1. Deux comptes dans le même groupe (2 navigateurs ou téléphone + web).
2. Compte A : ajouter un article courses.
3. Compte B : l'article apparaît sans pull-to-refresh (≤ 2 s).

Si ça ne sync pas : vérifier Realtime activé sur la table + RLS appliqué.

## Fallback

Sans Realtime activé, l'app reste utilisable via pull-to-refresh et invalidation locale après chaque action.
