# ADR-003 — Export liste de courses vers drive en ligne

- **Statut** : Accepté
- **Date** : 2026-05-28
- **Décideurs** : Steve, agent

## Contexte

Les utilisateurs veulent transférer leur liste homeshared vers Leclerc Drive, Auchan, Carrefour, etc. Aucune API publique officielle n'expose un « import panier » pour des apps tierces en France (2026).

## Décision

Stratégie **progressive en 3 niveaux**, sans scraping ni contournement des CGU :

| Niveau | Mécanisme | Statut homeshared |
|--------|-----------|-------------------|
| **v1** | Liens recherche par article (`/api/stores/suggest`) + copier-coller liste texte | ✅ Implémenté |
| **v1.1** | Deep links partiels (ouverture app/site drive + query pré-remplie quand URL stable) | Backlog |
| **v2** | Partenariat API / affiliate program magasin | Hors scope v1 |

Format export texte (Share API mobile) :

```
2 kg Pommes de terre
1 L Lait
3 Œufs
```

Chaque ligne = `{quantité} {unité} {nom}` — compatible collage manuel dans la barre recherche drive.

## Alternatives rejetées

- **Scraping / auto-fill DOM** : fragile, illégal selon CGU, maintenance impossible.
- **Open Food Facts seul** : utile pour barcode, pas pour remplir un panier drive.
- **IFTTT / Zapier** : pas de connecteur drive FR fiable.

## Conséquences

- ✅ UX immédiate : comparateur prix + ouverture navigateur par produit.
- ✅ Conformité légale et maintenance faible.
- ⚠️ Import panier reste semi-manuel jusqu'à partenariat.
- 🔄 À revoir si : un retailer publie une API panier (ex. Carrefour Developer).

## Références techniques

- `apps/api/src/routes/stores.routes.ts` — mock Leclerc/Auchan/Carrefour
- `apps/mobile/app/(app)/groups/[groupId]/shopping.tsx` — bouton « Exporter la liste »
- `apps/mobile/app/(app)/tools/stores.tsx` — comparateur multi-articles
