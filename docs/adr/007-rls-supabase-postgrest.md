# ADR-007 — RLS Supabase sur toutes les tables publiques

- **Statut** : Accepté
- **Date** : 2026-05-28
- **Décideurs** : Steve, agent

## Contexte

Le dashboard Supabase signale des tables **publiques sans RLS**. La clé `anon` embarquée dans l’app mobile permet d’appeler PostgREST : sans RLS, lecture/écriture/suppression possibles sur toute la base. Colonnes sensibles (`User.email`, `Invite.token`) exposées.

L’API homeshared utilise Prisma (connexion postgres, bypass RLS). Le client Supabase sert à l’**auth** et au **Realtime**.

## Décision

Activer **RLS sur toutes les tables** avec policies **SELECT** restrictives pour `authenticated` ; pas de policies d’écriture PostgREST.

Script : `supabase/rls/001_enable_rls.sql` — fonctions `is_group_member` / `is_group_admin`.

## Alternatives rejetées

- **Désactiver PostgREST** : non supporté proprement ; RLS est le standard Supabase
- **Révoquer GRANT anon** : casserait Auth/Realtime
- **Ne rien faire** : inacceptable en prod

## Conséquences

- ✅ Alertes sécurité Supabase résolues
- ✅ Realtime limité aux groupes de l’utilisateur
- ✅ API inchangée
- ⚠️ Toute future écriture directe via client Supabase devra ajouter des policies explicites (préférer l’API)
