import type { StoreRoute, RouteProgress } from './types.js';

export function computeRouteProgress(
  route: StoreRoute,
  purchasedIds: Set<string>,
): RouteProgress {
  const totalItems = route.steps.reduce((n, s) => n + s.items.length, 0);
  if (totalItems === 0) {
    return {
      percent: 100,
      currentStepIndex: 0,
      remainingItems: 0,
      remainingAisles: 0,
    };
  }

  let remainingItems = 0;
  let currentStepIndex = route.steps.length;

  for (let i = 0; i < route.steps.length; i++) {
    const step = route.steps[i]!;
    const stepRemaining = step.items.filter((it) => !purchasedIds.has(it.id)).length;
    if (stepRemaining > 0 && currentStepIndex === route.steps.length) {
      currentStepIndex = i;
    }
    remainingItems += stepRemaining;
  }

  const doneItems = totalItems - remainingItems;
  const remainingAisles = route.steps.filter((s) =>
    s.items.some((it) => !purchasedIds.has(it.id)),
  ).length;

  return {
    percent: Math.round((doneItems / totalItems) * 100),
    currentStepIndex: currentStepIndex >= route.steps.length ? 0 : currentStepIndex,
    remainingItems,
    remainingAisles,
  };
}
