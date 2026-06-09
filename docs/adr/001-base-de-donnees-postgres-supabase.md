# ADR-001 — Base de données Postgres via Supabase

- **Statut** : Accepté
- **Date** : 2026-05-27
- **Décideurs** : Steve, agent

## Contexte

homeshared a besoin d’une base relationnelle (groupes, membres, listes, frigo, recettes), d’une auth prête pour mobile/web, et d’un hébergement gratuit pour démarrer. La question MongoDB vs SQL s’est posée.

## Décision

Utiliser **PostgreSQL** comme source de vérité, avec **Prisma** comme ORM, et **Supabase** comme hébergement (Postgres + Auth + clés API). Le mobile s’authentifie via le client Supabase ; l’API valide le JWT avec la clé service.

## Alternatives rejetées

- **MongoDB** : modèle document adapté à d’autres cas, mais incompatible avec le schéma relationnel déjà modélisé en Prisma sans refonte majeure (jointures, intégrité référentielle, migrations Prisma).
- **Postgres seul (Docker/VPS) sans Supabase** : possible pour la DB, mais il faudrait reconstruire auth, stockage et temps réel — moins rapide pour une v1.
- **SQLite local uniquement** : simple pour un prototype solo, insuffisant pour multi-utilisateurs synchronisés en prod.

## Conséquences

- Positives : migrations Prisma, auth intégrée, passage à un autre Postgres (Neon, RDS) possible en changeant surtout `DATABASE_URL`.
- Négatives : dépendance à un fournisseur (mitigée par Postgres standard).
- À revoir si : besoin massif de schéma très flexible type « documents JSON arbitraires » sans relations — alors envisager une couche secondaire ou un autre service.
