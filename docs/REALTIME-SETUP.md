# Sync temps réel (Supabase Realtime)

homeshared invalide automatiquement les listes courses, frigo, planning et tâches quand un autre membre modifie les données (`useGroupRealtime` dans le layout groupe).

## Prérequis dashboard Supabase

1. **Database → Replication** (ou **Publications** selon l’UI Supabase)
2. Activer Realtime sur les tables :
   - `ShoppingItem`
   - `FridgeItem`
   - `MealPlanEntry`
   - `HouseholdTask`
   - `GroupMessage`
3. Vérifier que la publication `supabase_realtime` inclut ces tables.

## RLS (recommandé)

Sans RLS, Realtime peut exposer des changements à des clients non autorisés. À configurer dans Supabase SQL :

```sql
-- Exemple : l'utilisateur ne reçoit que les changements des groupes dont il est membre
-- (adapter selon votre modèle auth Supabase ↔ Prisma)

ALTER TABLE "ShoppingItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_see_group_shopping" ON "ShoppingItem"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Membership" m
      WHERE m."groupId" = "ShoppingItem"."groupId"
        AND m."userId" = auth.uid()
    )
  );
```

Répéter le pattern pour `FridgeItem`, `MealPlanEntry`, `HouseholdTask`, `GroupMessage`.

> **Note** : l’API homeshared utilise Prisma avec le service role ; RLS n’affecte pas l’API, seulement les clients Realtime avec la clé anon + JWT utilisateur.

## Test manuel

1. Deux comptes dans le même groupe (2 navigateurs ou téléphone + web).
2. Compte A : ajouter un article courses.
3. Compte B : l’article apparaît sans pull-to-refresh (≤ 2 s).

Si ça ne sync pas : vérifier Realtime activé sur la table + filtre `groupId` dans les logs Metro (`[realtime]` si debug ajouté).

## Fallback

Sans Realtime activé, l’app reste utilisable via pull-to-refresh et invalidation locale après chaque action.
