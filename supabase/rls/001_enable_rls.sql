-- homeshared — activation Row Level Security (RLS)
-- À exécuter dans Supabase → SQL Editor (projet homeshared).
--
-- Corrige les alertes :
--   • rls_disabled_in_public
--   • sensitive_columns_exposed (User.email, Invite.token, etc.)
--
-- L'API Fly utilise Prisma avec le rôle postgres (bypass RLS) → aucun impact sur l'API.
-- Le mobile n'utilise Supabase que pour Auth + Realtime (lecture filtrée par ces policies).

-- ---------------------------------------------------------------------------
-- Fonctions utilitaires
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Membership" m
    WHERE m."groupId" = p_group_id
      AND m."userId" = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Membership" m
    WHERE m."groupId" = p_group_id
      AND m."userId" = auth.uid()
      AND m.role IN ('OWNER', 'ADMIN')
  );
$$;

-- ---------------------------------------------------------------------------
-- User (données sensibles : email, etc.) — chacun voit uniquement sa ligne
-- ---------------------------------------------------------------------------

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_select_own" ON "User";
CREATE POLICY "user_select_own" ON "User"
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Pas de INSERT/UPDATE/DELETE via PostgREST (géré par l'API Prisma).

-- ---------------------------------------------------------------------------
-- Group — membres du groupe uniquement
-- ---------------------------------------------------------------------------

ALTER TABLE "Group" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_select_member" ON "Group";
CREATE POLICY "group_select_member" ON "Group"
  FOR SELECT TO authenticated
  USING (
    "ownerId" = auth.uid()
    OR public.is_group_member(id)
  );

-- ---------------------------------------------------------------------------
-- Membership
-- ---------------------------------------------------------------------------

ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "membership_select_own_or_cogroup" ON "Membership";
CREATE POLICY "membership_select_own_or_cogroup" ON "Membership"
  FOR SELECT TO authenticated
  USING (
    "userId" = auth.uid()
    OR public.is_group_member("groupId")
  );

-- ---------------------------------------------------------------------------
-- Données groupe — Realtime + lecture membres
-- ---------------------------------------------------------------------------

ALTER TABLE "ShoppingItem" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shopping_select_member" ON "ShoppingItem";
CREATE POLICY "shopping_select_member" ON "ShoppingItem"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "FridgeItem" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "fridge_select_member" ON "FridgeItem";
CREATE POLICY "fridge_select_member" ON "FridgeItem"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "MealPlanEntry" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meal_plan_select_member" ON "MealPlanEntry";
CREATE POLICY "meal_plan_select_member" ON "MealPlanEntry"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "HouseholdTask" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tasks_select_member" ON "HouseholdTask";
CREATE POLICY "tasks_select_member" ON "HouseholdTask"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "GroupMessage" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_select_member" ON "GroupMessage";
CREATE POLICY "messages_select_member" ON "GroupMessage"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "GroupMealSettings" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meal_settings_select_member" ON "GroupMealSettings";
CREATE POLICY "meal_settings_select_member" ON "GroupMealSettings"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "MemberMealGrant" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meal_grant_select_member" ON "MemberMealGrant";
CREATE POLICY "meal_grant_select_member" ON "MemberMealGrant"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

ALTER TABLE "MemberMealRule" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meal_rule_select_member" ON "MemberMealRule";
CREATE POLICY "meal_rule_select_member" ON "MemberMealRule"
  FOR SELECT TO authenticated
  USING (public.is_group_member("groupId"));

-- ---------------------------------------------------------------------------
-- Invite (token sensible) — admins du groupe seulement
-- ---------------------------------------------------------------------------

ALTER TABLE "Invite" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invite_select_admin" ON "Invite";
CREATE POLICY "invite_select_admin" ON "Invite"
  FOR SELECT TO authenticated
  USING (public.is_group_admin("groupId"));

-- ---------------------------------------------------------------------------
-- Données personnelles utilisateur
-- ---------------------------------------------------------------------------

ALTER TABLE "RecipeFavorite" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipe_fav_select_own" ON "RecipeFavorite";
CREATE POLICY "recipe_fav_select_own" ON "RecipeFavorite"
  FOR SELECT TO authenticated
  USING ("userId" = auth.uid());

ALTER TABLE "RecipeProposalDismiss" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipe_dismiss_select_own" ON "RecipeProposalDismiss";
CREATE POLICY "recipe_dismiss_select_own" ON "RecipeProposalDismiss"
  FOR SELECT TO authenticated
  USING ("userId" = auth.uid());

-- ---------------------------------------------------------------------------
-- Catalogue (lecture seule pour utilisateurs connectés)
-- ---------------------------------------------------------------------------

ALTER TABLE "Recipe" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipe_select_authenticated" ON "Recipe";
CREATE POLICY "recipe_select_authenticated" ON "Recipe"
  FOR SELECT TO authenticated
  USING (true);

ALTER TABLE "Ingredient" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ingredient_select_authenticated" ON "Ingredient";
CREATE POLICY "ingredient_select_authenticated" ON "Ingredient"
  FOR SELECT TO authenticated
  USING (true);

ALTER TABLE "RecipeIngredient" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recipe_ingredient_select_authenticated" ON "RecipeIngredient";
CREATE POLICY "recipe_ingredient_select_authenticated" ON "RecipeIngredient"
  FOR SELECT TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- Vérification (optionnel — doit retourner 0 ligne si tout est activé)
-- ---------------------------------------------------------------------------
-- SELECT tablename FROM pg_tables t
-- JOIN pg_class c ON c.relname = t.tablename
-- WHERE t.schemaname = 'public'
--   AND c.relrowsecurity = false
--   AND t.tablename NOT LIKE 'pg_%'
--   AND t.tablename NOT LIKE '_prisma%';
