import type { Prisma } from '@prisma/client';

interface AddToFridgeInput {
  groupId: string;
  name: string;
  quantity: number;
  unit: string | null;
}

/**
 * Ajoute une denrée au frigo d'un groupe.
 *
 * Stratégie de fusion : si un item existe déjà avec le même `name` (case-insensitive)
 * et le même `unit` (ou les deux null), on agrège les quantités sur l'entrée existante
 * la plus récente. Sinon on crée une nouvelle entrée.
 *
 * Trade-off : on évite la prolifération de doublons "Lait", "lait", "lait entier"
 * tout en gardant la possibilité d'avoir plusieurs lots avec des unités différentes.
 */
export async function addToFridge(
  tx: Prisma.TransactionClient,
  input: AddToFridgeInput,
): Promise<void> {
  const normalizedName = input.name.trim();
  const unitValue = input.unit?.trim() || null;
  const existing = await tx.fridgeItem.findFirst({
    where: {
      groupId: input.groupId,
      name: { equals: normalizedName, mode: 'insensitive' },
      ...(unitValue === null ? { unit: { equals: null } } : { unit: unitValue }),
    },
    orderBy: { addedAt: 'desc' },
  });

  if (existing) {
    await tx.fridgeItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: input.quantity } },
    });
    return;
  }

  await tx.fridgeItem.create({
    data: {
      groupId: input.groupId,
      name: normalizedName,
      quantity: input.quantity,
      unit: unitValue,
    },
  });
}
