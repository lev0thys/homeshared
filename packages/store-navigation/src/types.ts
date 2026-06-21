import type { StoreAisleId } from '@homeshared/shared';

export type StoreLayoutProfileId = 'HYPERMARKET_FR' | 'SUPERMARKET_FR' | 'PROXI_FR';

/** Zone du plan : allée centrale, échoppe en périphérie, couloir ou caisses. */
export type FloorZoneKind = 'aisle' | 'shop' | 'corridor' | 'checkout';

export interface FloorZone {
  kind: FloorZoneKind;
  /** Libellé court affiché sur le plan (ex. « Allée 3 », « Boucherie »). */
  label: string;
  rect: { x: number; y: number; w: number; h: number };
  aisle?: StoreAisleId;
}

export interface LayoutNode {
  aisle: StoreAisleId;
  /** Coordonnées schématiques 0–1 (rendu SVG). */
  x: number;
  y: number;
}

export interface StoreLayout {
  id: StoreLayoutProfileId;
  label: string;
  entry: { x: number; y: number };
  /** Entrée secondaire (ex. « marché frais » côté gauche sur les hypers). */
  secondaryEntry?: { x: number; y: number; label?: string };
  nodes: LayoutNode[];
  /** Allées + échoppes pour le rendu 2D (coords 0–1). */
  zones: FloorZone[];
}

export interface RouteItem {
  id: string;
  name: string;
  quantity?: string;
  unit?: string | null;
}

export interface BuildRouteInput {
  items: Array<{
    id: string;
    name: string;
    aisle: StoreAisleId;
    purchased: boolean;
    quantity?: string;
    unit?: string | null;
  }>;
  profile?: StoreLayoutProfileId;
}

export interface StoreRouteStep {
  aisle: StoreAisleId;
  items: RouteItem[];
}

export interface StoreRoute {
  profile: StoreLayoutProfileId;
  steps: StoreRouteStep[];
  skippedAisles: StoreAisleId[];
  /** Points du chemin sur le plan (entrée → rayons). */
  polyline: Array<{ x: number; y: number }>;
  estimatedAisles: number;
}

export interface RouteProgress {
  percent: number;
  currentStepIndex: number;
  remainingItems: number;
  remainingAisles: number;
}
