# Rapports métriques hebdomadaires

Rapports automatiques : utilisateurs, activité, taille BDD, coûts et revenus **estimés**.

## Génération

### Local (Steve)

```powershell
# Depuis la racine homeshared, avec .env (DIRECT_DATABASE_URL)
pnpm metrics:weekly
```

Fichier créé : `reports/metrics/YYYY-MM-DD.md`

### GitHub Actions (automatique)

Workflow **`.github/workflows/weekly-metrics.yml`** — chaque **lundi 07:00 UTC**.

**Secret requis** (repo → Settings → Secrets) :

| Secret | Description |
|--------|-------------|
| `DIRECT_DATABASE_URL` | URL Postgres directe Supabase (port 5432) |

Déclenchement manuel : Actions → **Weekly metrics report** → **Run workflow**.

Le workflow :

1. Génère le rapport
2. Commit sur `dev` si changement
3. Publie un résumé dans l’onglet Summary du job
4. Attache l’artifact `weekly-metrics-report`

## Lecture

- Ouvrir le dernier fichier `reports/metrics/YYYY-MM-DD.md`
- Section **Alertes** : points d’attention
- Section **Solde médian** : pubs estimées − coûts estimés

Les montants sont **indicatifs** (pas les factures réelles Fly / Supabase / AdMob).

## Doc liée

- `docs/METRICS-WEEKLY.md` — détail des indicateurs et seuils
- `docs/V2-GPS-IMPLEMENTATION.md` §3.9–3.10 — coûts à la croissance
