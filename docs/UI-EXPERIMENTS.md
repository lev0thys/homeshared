# Expérimentations UI / navigation

Base stable : **v1.1.0** (`release/v1.1`, tag `v1.1.0`).  
Version produit d’origine : **v1.0.0** (`release/v1.0`, tag `v1.0.0`).

## Branches

| Branche | Rôle |
|---------|------|
| `release/v1.0` | v1.0 figée — ne pas modifier |
| `release/v1.1` | v1.1 stable — point de départ des tests UI |
| `experiment/ui` | travail courant refonte visuelle / navigation |
| `experiment/ui-a` | variante graphique A (à créer) |
| `experiment/ui-b` | variante graphique B (à créer) |
| `experiment/ui-c` | variante graphique C (à créer) |
| `dev` | intégration quotidienne (merge de la variante retenue) |

## Créer une variante de test

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared
git fetch origin
git checkout -b experiment/ui-a origin/release/v1.1
# … changements visuels …
git push -u origin experiment/ui-a
```

Répéter avec `ui-b`, `ui-c`, etc.

## Revenir en arrière

```powershell
# Reprendre la base stable v1.1
git checkout experiment/ui
git reset --hard release/v1.1

# Reprendre la v1.0 d’origine
git checkout release/v1.0
```

## Retenir une variante

1. Merger la branche gagnante dans `dev` (review + `pnpm verify`).
2. Promouvoir `dev` → `commit` → `main` quand validé.
3. Tag `v1.2.0` ou `v2.0.0` selon l’ampleur du changement.

## Déploiement preview (optionnel)

Une branche `experiment/ui-*` peut être déployée sur un preview Vercel séparé pour comparaison côte à côte.
