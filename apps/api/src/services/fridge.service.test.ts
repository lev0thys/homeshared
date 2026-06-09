import { describe, expect, it, vi } from 'vitest';
import { addToFridge } from './fridge.service.js';

describe('addToFridge', () => {
  it('incrémente la quantité si un item similaire existe', async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const tx = {
      fridgeItem: {
        findFirst: vi.fn().mockResolvedValue({ id: 'f1', quantity: 2 }),
        update,
        create: vi.fn(),
      },
    } as never;

    await addToFridge(tx, { groupId: 'g1', name: 'Lait', quantity: 1, unit: 'L' });

    expect(update).toHaveBeenCalledWith({
      where: { id: 'f1' },
      data: { quantity: { increment: 1 } },
    });
  });

  it('crée un nouvel item si aucune correspondance', async () => {
    const create = vi.fn().mockResolvedValue(undefined);
    const tx = {
      fridgeItem: {
        findFirst: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
        create,
      },
    } as never;

    await addToFridge(tx, { groupId: 'g1', name: 'Tomates', quantity: 3, unit: null });

    expect(create).toHaveBeenCalledWith({
      data: {
        groupId: 'g1',
        name: 'Tomates',
        quantity: 3,
        unit: null,
      },
    });
  });
});
