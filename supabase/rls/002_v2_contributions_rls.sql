-- homeshared — RLS tables v2 (contributions) + _prisma_migrations
-- À exécuter après db push des modèles StoreContribution* / ContributorTrust.
-- Complète supabase/rls/001_enable_rls.sql
--
-- Principe : aucune policy PostgREST → lecture/écriture client Supabase bloquée.
-- L'API Fly (Prisma / rôle postgres) bypass RLS.

-- ---------------------------------------------------------------------------
-- _prisma_migrations — historique Prisma, jamais exposé au client
-- ---------------------------------------------------------------------------

ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Contributions mode magasin — agrégation via API uniquement
-- ---------------------------------------------------------------------------

ALTER TABLE "StoreContributionBatch" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "StoreContributionEvent" ENABLE ROW LEVEL SECURITY;

-- Score de confiance interne (jamais affiché utilisateur)
ALTER TABLE "ContributorTrust" ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Vérification (doit retourner 0 ligne)
-- ---------------------------------------------------------------------------
-- SELECT t.tablename
-- FROM pg_tables t
-- JOIN pg_class c ON c.relname = t.tablename AND c.relnamespace = 'public'::regnamespace
-- WHERE t.schemaname = 'public'
--   AND c.relrowsecurity = false
--   AND t.tablename NOT LIKE 'pg_%';
