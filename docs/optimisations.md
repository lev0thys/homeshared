# Optimisations — homeshared

Document de référence pour les gains perf déjà appliqués et les pistes backlog.

## API

### Planning repas — scores frigo (fait)

**Avant** : `getMealPlanForWeek` appelait `fridgeScoreForRecipe` par entrée → N× (frigo + `computeMealPlanReservations` + recette).

**Après** : `fridgeScoresForMealPlanEntries` dans `meal-plan-fridge.service.ts` :
- 1× frigo, 1× réservations globales, 1× `recipe.findMany` pour les IDs de la semaine ;
- par entrée : `reservationsWithoutEntry` + `scoreRecipeWithFridge` en mémoire.

Fichiers : `fridge-availability.service.ts` (`scoreRecipeWithFridge`, `reservationsWithoutEntry`), `meal-plan.service.ts`.

### Catalogue ingrédients (fait)

Cache module TTL 5 min sur `prisma.ingredient.findMany` dans `getFridgeAvailability` (liste stable en prod).

### Déjà en place (sessions précédentes)

- Cache auth JWT 5 min (`auth-cache.service.ts`).
- `withPrismaReconnect` sur erreurs connexion Prisma.
- `staticCatalogQueryOptions` côté mobile (saison/jardin/recettes catalogue, stale 24 h).

## Mobile

### Typecheck CI (fait)

- `api.put` ajouté au client HTTP.
- Génériques explicites sur `useQuery` / callbacks (évite `implicit any` avec TanStack Query v5).
- Suppression de `headerRightContainerStyle` (non typé sur la stack Expo actuelle).

## Backlog perf (non fait)

| Sujet | Impact | Complexité |
|-------|--------|------------|
| Pagination / filtre cuisine sur `POST /api/recipes/match` (231 recettes) | Fort si frigo chargé souvent | 4/10 |
| Index DB sur `mealPlanEntry(groupId, cookedAt)` | Moyen à grosse volumétrie | 2/10 |
| Prefetch React Query au focus groupe | UX | 3/10 |
| ESLint 9 flat config monorepo | DX / CI optionnelle | 3/10 |

## Vérification

```powershell
pnpm typecheck   # API + mobile
pnpm test        # 37 tests API
node scripts/test-features-api.mjs   # API up + prisma:db-push
```
