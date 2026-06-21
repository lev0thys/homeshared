# Sécurité Supabase — RLS (Row Level Security)

## Problème (alertes dashboard)

Si Supabase affiche **CRITICAL** :

| Alerte | Risque |
|--------|--------|
| `rls_disabled_in_public` | Avec la clé **anon** (dans l’app mobile), n’importe qui peut lire/modifier/supprimer les tables via l’API REST Supabase |
| `sensitive_columns_exposed` | Colonnes sensibles (`User.email`, `Invite.token`, etc.) accessibles sans filtre |

> L’app homeshared passe par l’**API Fly** pour les écritures, mais le client Supabase (anon + JWT) peut quand même atteindre PostgREST si RLS est désactivé.

## Solution

Script SQL versionné :

| Fichier | Rôle |
|---------|------|
| `supabase/rls/001_enable_rls.sql` | RLS tables v1 |
| `supabase/rls/002_v2_contributions_rls.sql` | RLS `_prisma_migrations` + contributions v2 |
| `supabase/rls/003_auth_initplan.sql` | Corrige warnings « Auth RLS Initialization Plan » |

Commande : **`pnpm rls:apply`** (exécute les 3 scripts dans l’ordre).

### Étapes (5 min)

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard) → projet **homeshared**
2. **SQL Editor** → New query
3. Copier-coller tout le contenu de `supabase/rls/001_enable_rls.sql` **puis** `002_v2_contributions_rls.sql` **puis** `003_auth_initplan.sql`  
   **Ou** à la racine : `pnpm rls:apply`
4. **Run**
5. **Database → Security** (ou Advisors) → rafraîchir → les alertes RLS doivent disparaître

### Ce que ça fait

- Active **RLS** sur toutes les tables Prisma publiques
- **SELECT** uniquement pour le rôle `authenticated` :
  - Données groupe → membres du groupe (`Membership`)
  - `User` → **sa propre ligne** (email protégé)
  - `Invite` → admins du groupe seulement (token protégé)
  - Catalogue recettes → lecture pour users connectés
- **Aucune policy INSERT/UPDATE/DELETE** via PostgREST → écritures refusées côté client Supabase (l’API Prisma continue via rôle `postgres`)

### Impact sur l’app

| Composant | Impact |
|-----------|--------|
| API Fly (Prisma) | ✅ Aucun — rôle postgres bypass RLS |
| Auth Supabase | ✅ Inchangé |
| Realtime (`useGroupRealtime`) | ✅ Fonctionne — l’user ne reçoit que les changements de **ses** groupes |
| Mobile / Web | ✅ Pas d’écriture directe Supabase aujourd’hui |

### Test après application

1. Deux comptes dans le même groupe → Realtime courses OK (voir `docs/REALTIME-SETUP.md`)
2. Dashboard Supabase → Security → plus d’alerte RLS critique

### Si Realtime ne sync plus

Vérifier que l’utilisateur est bien connecté Supabase (session JWT) avant d’entrer dans un groupe — `auth.uid()` doit correspondre à `User.id` (déjà le cas dans homeshared).

---

**Priorité** : à appliquer **avant** montée en charge ou publication large.
