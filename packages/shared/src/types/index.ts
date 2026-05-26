export type Iso8601 = string;
export type UUID = string;

export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface UserPublic {
  id: UUID;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Iso8601;
}

export interface Group {
  id: UUID;
  name: string;
  description: string | null;
  ownerId: UUID;
  createdAt: Iso8601;
  updatedAt: Iso8601;
}

export interface GroupMembership {
  id: UUID;
  groupId: UUID;
  userId: UUID;
  role: GroupRole;
  joinedAt: Iso8601;
}

export interface ShoppingItem {
  id: UUID;
  groupId: UUID;
  name: string;
  quantity: number;
  unit: string | null;
  notes: string | null;
  addedByUserId: UUID;
  addedAt: Iso8601;
  purchasedAt: Iso8601 | null;
  purchasedByUserId: UUID | null;
}

export interface FridgeItem {
  id: UUID;
  groupId: UUID;
  name: string;
  quantity: number;
  unit: string | null;
  addedAt: Iso8601;
  expiresAt: Iso8601 | null;
}

export interface Recipe {
  id: UUID;
  title: string;
  description: string | null;
  instructions: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  imageUrl: string | null;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: UUID;
  recipeId: UUID;
  name: string;
  quantity: number;
  unit: string | null;
  optional: boolean;
}
