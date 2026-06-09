/**
 * Migration one-shot vers le catalogue d'ingrédients.
 * Supprime uniquement recettes + lignes (conserve users, groupes, frigo, courses).
 * Puis applique le schéma via `prisma db push` (à lancer juste après).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deletedLines = await prisma.recipeIngredient.deleteMany();
  const deletedRecipes = await prisma.recipe.deleteMany();
  console.log(
    `Recettes supprimées : ${deletedRecipes.count} recettes, ${deletedLines.count} lignes.`,
  );
  console.log('Exécutez ensuite : pnpm --filter @homeshared/api prisma:db-push');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
