-- homeshared — corrige les alertes Supabase « Auth RLS Initialization Plan »
-- Remplace auth.uid() par (select auth.uid()) pour stabiliser le plan de requête.
-- Ré-exécutable (DROP POLICY IF EXISTS + CREATE).

-- User
DROP POLICY IF EXISTS "user_select_own" ON "User";
CREATE POLICY "user_select_own" ON "User"
  FOR SELECT TO authenticated
  USING (id = (select auth.uid()));

-- Group
DROP POLICY IF EXISTS "group_select_member" ON "Group";
CREATE POLICY "group_select_member" ON "Group"
  FOR SELECT TO authenticated
  USING (
    "ownerId" = (select auth.uid())
    OR public.is_group_member(id)
  );

-- Membership
DROP POLICY IF EXISTS "membership_select_own_or_cogroup" ON "Membership";
CREATE POLICY "membership_select_own_or_cogroup" ON "Membership"
  FOR SELECT TO authenticated
  USING (
    "userId" = (select auth.uid())
    OR public.is_group_member("groupId")
  );

-- RecipeFavorite
DROP POLICY IF EXISTS "recipe_fav_select_own" ON "RecipeFavorite";
CREATE POLICY "recipe_fav_select_own" ON "RecipeFavorite"
  FOR SELECT TO authenticated
  USING ("userId" = (select auth.uid()));

-- RecipeProposalDismiss
DROP POLICY IF EXISTS "recipe_dismiss_select_own" ON "RecipeProposalDismiss";
CREATE POLICY "recipe_dismiss_select_own" ON "RecipeProposalDismiss"
  FOR SELECT TO authenticated
  USING ("userId" = (select auth.uid()));
