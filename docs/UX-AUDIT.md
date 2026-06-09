# Audit UX — homeshared vs apps de référence

**Date** : 2026-05-28  
**Références** : [AnyList](https://www.anylist.com/lists), Bring!, Listonic

## Patterns adoptés (session optimisation)

| Pattern AnyList / Bring | Implémentation homeshared |
|-------------------------|---------------------------|
| Coche circulaire à gauche, zone 44pt | `ChecklistToggle` sur liste courses |
| Barre de progression « X/Y cochés » | `ListProgressBar` |
| Sections « À acheter » / « Dans le caddie » | `SectionList` courses |
| Pull-to-refresh | Hub groupes + liste courses |
| Suggestions à la saisie | `IngredientSuggestInput` (existant) |
| Quantité en badge distinct | Badge qty à droite de chaque ligne |
| Navigation par onglets avec icônes | Tab bar 🏠🛒🧊🍳 |
| Empty states avec icône + titre | `EmptyState` enrichi |
| Clavier ne masque pas la saisie | `Screen keyboard` + KAV |
| Safe area dock bas | `useSafeAreaInsets` sur hub |

## Écarts restants (backlog v1.x)

- Catégories magasin auto (AnyList) — v2 avec ML ou règles
- Photos produits (Open Food Facts) — backlog
- Scan code-barres — v2
- Réorganisation drag & drop des articles — v1.2
- Thèmes / dark mode — v1.1
- Indicateur « X a modifié la liste » (Bring) — v1.2 temps réel

## Tests automatisés

```powershell
pnpm test:features   # 12 endpoints API
pnpm --filter @homeshared/api test   # 15+ unit tests
```

## Palette Tailwind

Tokens `ink` 200–800 et `emerald` complétés — corrige les styles « fantômes » sur ~15 écrans.
