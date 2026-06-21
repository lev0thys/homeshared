# Métriques hebdomadaires — homeshared

> Suivi régulier des coûts potentiels, utilisateurs et viabilité — **1 rapport / semaine**.

## Objectif

Permettre à Steve de voir sans effort :

- Combien d’utilisateurs et d’actifs (7 j / 30 j)
- Si l’infra (Fly, Supabase, Vercel) risque de dépasser les revenus pubs
- Si la prod API répond

## Mécanique

| Canal | Fréquence | Commande / trigger |
|-------|-----------|----------------------|
| **CI GitHub** | Lundi 07:00 UTC | `weekly-metrics.yml` |
| **Local** | À la demande | `pnpm metrics:weekly` |

## Indicateurs collectés

### Depuis PostgreSQL (Prisma)

| Métrique | Usage |
|----------|--------|
| Users total / nouveaux 7 j | Croissance |
| Actifs 7 j / 30 j | Proxy MAU/DAU (courses + messages) |
| Groupes, courses, achats, messages | Engagement |
| Taille BDD (Mo) | Seuil Supabase free / upgrade |

### Depuis l’API prod

`GET /health/db` sur `METRICS_API_URL` (défaut `https://homeshared-api.fly.dev`).

### Estimations (script)

- **Coûts** : formules par palier dans `apps/api/scripts/weekly-metrics.ts` (`estimateMonthlyCosts`)
- **Revenus pubs** : bannière + rewarded (proxy achats 7 j) — fourchettes prudent / médian / optimiste

## Seuils d’alerte (rapport)

| Alerte | Condition |
|--------|-----------|
| Coûts medium/high | Total estimé > 80 €/mois |
| Solde négatif | Revenus médians < coûts et actifs 30 j > 50 |
| Pas de nouveaux users | `newUsers7d === 0` (info) |

## Setup CI (une fois)

```powershell
gh secret set DIRECT_DATABASE_URL --body "postgresql://..." --repo <owner>/homeshared
```

Utiliser l’URL **directe** Supabase (port 5432), pas le pooler transaction, pour les requêtes admin.

## Après le lancement GPS v2

Ajouter au script (itération future) :

- Compteur `StoreContributionBatch` (quand table existante)
- Sessions mode magasin si event analytics

## Arbitrage monétisation

Si **solde médian négatif 3 semaines de suite** → voir `BACKLOG.md` entrée « Monétisation homeshared+ ».
