import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import {
  getCanvasPixelSize,
  getCorridorStyle,
  getShopZoneStyle,
  getFloorZoneStyle,
  GONDOLA_STYLE,
  MAP_PAPER,
  PX_PER_METER,
  ROUTE_STYLE,
  type StoreLayout,
} from '@homeshared/store-navigation';
import type { StoreAisleId } from '@homeshared/shared';
import { getStoreAisleDefinition } from '@homeshared/shared';
import { buildShelfStripsInZone } from '@/components/store-mode/store-map-shelves';
import {
  centerViewBoxOnNormPoint,
  fitViewBoxToViewport,
  panViewBox,
  screenToNorm,
  zoomPercent,
  zoomViewBox,
  type MapViewBox,
} from '@/components/store-mode/store-map-viewport';

export interface StoreMapItemPin {
  id: string;
  name: string;
  x: number;
  y: number;
  highlighted?: boolean;
}

interface StoreMap2DProps {
  layout: StoreLayout;
  polyline: Array<{ x: number; y: number }>;
  currentAisle?: StoreAisleId;
  userPosition?: { x: number; y: number };
  onRecalibrate?: (position: { x: number; y: number }) => void;
  communityPins?: Array<{ x: number; y: number }>;
  itemPins?: StoreMapItemPin[];
  layoutBadge?: string;
  mapLegend?: string;
  zoomHint?: string;
  centerOnMeLabel?: string;
  fitAllLabel?: string;
  /** Afficher le tracé d’itinéraire optimisé (navigation GPS). */
  showRoute?: boolean;
  fullScreen?: boolean;
}

const TOOLBAR_H = 44;
const COMPACT_MAP_H = 300;

const ZONE_LAYER = { corridor: 0, aisle: 1, shop: 2, checkout: 3 } as const;

function zoneStyleFor(zone: { kind: keyof typeof ZONE_LAYER; label: string }) {
  if (zone.kind === 'corridor') return getCorridorStyle(zone.label);
  if (zone.kind === 'shop') return getShopZoneStyle(zone.label);
  return getFloorZoneStyle(zone.kind);
}

export function StoreMap2D({
  layout,
  polyline,
  currentAisle,
  userPosition,
  onRecalibrate,
  communityPins = [],
  itemPins = [],
  layoutBadge,
  mapLegend,
  zoomHint,
  centerOnMeLabel = 'Centrer',
  fitAllLabel = 'Tout voir',
  showRoute = true,
  fullScreen = true,
}: StoreMap2DProps) {
  const { width: windowW, height: windowH } = useWindowDimensions();
  const fallbackMapH = Math.max(280, Math.floor(windowH * 0.4));
  const canvas = getCanvasPixelSize(layout.id);
  const worldW = canvas.width;
  const worldH = canvas.height;

  const user = userPosition ?? layout.entry;

  const [mapArea, setMapArea] = useState({ w: 0, h: 0 });
  const [viewBox, setViewBox] = useState<MapViewBox>(() =>
    fitViewBoxToViewport(windowW, fallbackMapH, worldW, worldH),
  );
  const viewBoxRef = useRef(viewBox);
  const panBaseRef = useRef(viewBox);
  const pinchBaseRef = useRef(viewBox);

  const viewportW = fullScreen
    ? mapArea.w > 0
      ? mapArea.w
      : windowW
    : Math.min(windowW - 32, 400);
  const viewportH = fullScreen
    ? mapArea.h > 0
      ? mapArea.h
      : fallbackMapH
    : COMPACT_MAP_H;

  useEffect(() => {
    viewBoxRef.current = viewBox;
  }, [viewBox]);

  const centerOnUser = useCallback(() => {
    if (viewportW <= 0 || viewportH <= 0) return;
    setViewBox(centerViewBoxOnNormPoint(user.x, user.y, worldW, worldH, viewportW, viewportH));
  }, [user.x, user.y, viewportH, viewportW, worldH, worldW]);

  const fitAll = useCallback(() => {
    if (viewportW <= 0 || viewportH <= 0) return;
    setViewBox(fitViewBoxToViewport(viewportW, viewportH, worldW, worldH));
  }, [viewportH, viewportW, worldH, worldW]);

  const handleMapAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setMapArea({ w: width, h: height });
    }
  }, []);

  const layoutCenterKey = `${layout.id}:${worldW}x${worldH}:${mapArea.w}x${mapArea.h}`;

  useEffect(() => {
    if (viewportW <= 0 || viewportH <= 0) return;
    setViewBox(centerViewBoxOnNormPoint(user.x, user.y, worldW, worldH, viewportW, viewportH));
    // Recentre au changement de plan ou de taille d’écran, pas à chaque tick PDR.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layoutCenterKey capture layout + viewport
  }, [layoutCenterKey]);

  const toWorld = useCallback(
    (nx: number, ny: number) => ({ wx: nx * worldW, wy: ny * worldH }),
    [worldH, worldW],
  );

  const activeNode = layout.nodes.find((n) => n.aisle === currentAisle);

  const sortedZones = useMemo(
    () =>
      [...layout.zones].sort((a, b) => {
        const orderDiff = ZONE_LAYER[a.kind] - ZONE_LAYER[b.kind];
        if (orderDiff !== 0) return orderDiff;
        return a.rect.y - b.rect.y;
      }),
    [layout.zones],
  );

  const corridorZones = useMemo(
    () => sortedZones.filter((z) => z.kind === 'corridor'),
    [sortedZones],
  );
  const buildingZones = useMemo(
    () => sortedZones.filter((z) => z.kind !== 'corridor'),
    [sortedZones],
  );

  const shelfStrips = useMemo(
    () => sortedZones.flatMap((zone) => buildShelfStripsInZone(zone, layout.id)),
    [layout.id, sortedZones],
  );

  const routePoints = useMemo(
    () =>
      polyline
        .map((p) => toWorld(p.x, p.y))
        .map((p) => `${p.wx},${p.wy}`)
        .join(' '),
    [polyline, toWorld],
  );

  const zoomLevel = zoomPercent(viewBox, worldW);
  const zoomRatio = worldW / viewBox.w;
  const showFineGrid = zoomRatio > 1.8;
  const showZoneLabels = zoomRatio < 2.8;
  const showItemLabels = zoomRatio > 2.5;

  const gridStep = showFineGrid ? PX_PER_METER : PX_PER_METER * 5;

  const gridLines = useMemo(() => {
    const vertical: number[] = [];
    const horizontal: number[] = [];
    for (let x = 0; x <= worldW; x += gridStep) vertical.push(x);
    for (let y = 0; y <= worldH; y += gridStep) horizontal.push(y);
    return { vertical, horizontal };
  }, [gridStep, worldH, worldW]);

  const handleRecalibrateFromScreen = useCallback(
    (localX: number, localY: number) => {
      if (!onRecalibrate) return;
      onRecalibrate(screenToNorm(localX, localY, viewBox, viewportW, viewportH, worldW, worldH));
    },
    [onRecalibrate, viewBox, viewportH, viewportW, worldH, worldW],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      setViewBox((vb) => zoomViewBox(vb, factor, worldW, worldH));
    },
    [worldH, worldW],
  );

  const beginPan = useCallback(() => {
    panBaseRef.current = viewBoxRef.current;
  }, []);

  const applyPan = useCallback(
    (translationX: number, translationY: number) => {
      setViewBox(
        panViewBox(
          panBaseRef.current,
          translationX,
          translationY,
          viewportW,
          viewportH,
          worldW,
          worldH,
        ),
      );
    },
    [viewportH, viewportW, worldH, worldW],
  );

  const beginPinch = useCallback(() => {
    pinchBaseRef.current = viewBoxRef.current;
  }, []);

  const applyPinch = useCallback(
    (scale: number) => {
      setViewBox(zoomViewBox(pinchBaseRef.current, scale, worldW, worldH));
    },
    [worldH, worldW],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      runOnJS(beginPan)();
    })
    .onUpdate((e) => {
      runOnJS(applyPan)(e.translationX, e.translationY);
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      runOnJS(beginPinch)();
    })
    .onUpdate((e) => {
      runOnJS(applyPinch)(e.scale);
    });

  const longPress = Gesture.LongPress()
    .minDuration(450)
    .maxDistance(14)
    .onEnd((e) => {
      runOnJS(handleRecalibrateFromScreen)(e.x, e.y);
    });

  const composed = Gesture.Simultaneous(pinch, Gesture.Race(longPress, pan));

  const viewBoxStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
  const scaleBarMeters = zoomRatio > 3 ? 1 : 5;
  const scaleBarWorld = scaleBarMeters * PX_PER_METER;
  const routeWidth = Math.max(3, Math.min(8, 5 * (zoomRatio / 4)));
  const showEntryLink =
    Math.hypot(user.x - layout.entry.x, user.y - layout.entry.y) > 0.02;

  const mapReady = viewportW > 0 && viewportH > 0;

  return (
    <View
      className={fullScreen ? 'flex-1 overflow-hidden bg-slate-50' : 'rounded-2xl border border-ink-100 overflow-hidden bg-slate-50'}
    >
      <View
        className="flex-row items-center justify-between px-2 bg-white border-b border-ink-100"
        style={{ height: TOOLBAR_H }}
      >
        <Text className="text-xs text-ink-500 flex-1 pr-2" numberOfLines={1}>
          {zoomHint}
        </Text>
        <View className="flex-row gap-1">
          <Pressable
            onPress={centerOnUser}
            className="w-8 h-8 items-center justify-center rounded-lg bg-ink-100"
            accessibilityLabel={centerOnMeLabel}
          >
            <Text className="text-sm font-bold text-ink-700">◎</Text>
          </Pressable>
          <Pressable
            onPress={() => zoomBy(1 / 1.35)}
            className="w-8 h-8 items-center justify-center rounded-lg bg-ink-100"
            accessibilityLabel="Dézoomer"
          >
            <Text className="text-base font-bold text-ink-700">−</Text>
          </Pressable>
          <Pressable
            onPress={fitAll}
            className="px-2 h-8 items-center justify-center rounded-lg bg-ink-100"
            accessibilityLabel={fitAllLabel}
          >
            <Text className="text-xs font-medium text-ink-600">{zoomLevel}%</Text>
          </Pressable>
          <Pressable
            onPress={() => zoomBy(1.35)}
            className="w-8 h-8 items-center justify-center rounded-lg bg-ink-100"
            accessibilityLabel="Zoomer"
          >
            <Text className="text-base font-bold text-ink-700">+</Text>
          </Pressable>
        </View>
      </View>

      <View
        className="flex-1 relative w-full"
        style={[
          styles.mapSlot,
          !fullScreen ? { width: viewportW, height: viewportH, flex: undefined } : null,
        ]}
        onLayout={fullScreen ? handleMapAreaLayout : undefined}
      >
        {mapReady ? (
          <GestureDetector gesture={composed}>
            <View style={styles.mapFill}>
              <Svg
                width="100%"
                height="100%"
                viewBox={viewBoxStr}
                preserveAspectRatio="none"
                accessibilityLabel="Plan du magasin avec couloirs et rayons"
              >
                <Rect
                  x={0}
                  y={0}
                  width={worldW}
                  height={worldH}
                  fill={MAP_PAPER.background}
                  stroke={MAP_PAPER.border}
                  strokeWidth={1.5}
                />

                {showFineGrid ? (
                  <G opacity={MAP_PAPER.gridOpacity}>
                    {gridLines.vertical.map((x) => (
                      <Line
                        key={`gv-${x}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={worldH}
                        stroke={MAP_PAPER.grid}
                        strokeWidth={0.6}
                      />
                    ))}
                    {gridLines.horizontal.map((y) => (
                      <Line
                        key={`gh-${y}`}
                        y1={y}
                        x1={0}
                        y2={y}
                        x2={worldW}
                        stroke={MAP_PAPER.grid}
                        strokeWidth={0.6}
                      />
                    ))}
                  </G>
                ) : null}

                {corridorZones.map((zone, idx) => {
                  const { wx, wy } = toWorld(zone.rect.x, zone.rect.y);
                  const zw = zone.rect.w * worldW;
                  const zh = zone.rect.h * worldH;
                  if (zw < 1.5 || zh < 1.5) return null;
                  const style = getCorridorStyle(zone.label);
                  return (
                    <Rect
                      key={`street-${idx}`}
                      x={wx}
                      y={wy}
                      width={zw}
                      height={zh}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={1}
                      rx={2}
                    />
                  );
                })}

                {buildingZones.map((zone, idx) => {
                  const { wx, wy } = toWorld(zone.rect.x, zone.rect.y);
                  const zw = zone.rect.w * worldW;
                  const zh = zone.rect.h * worldH;
                  if (zw < 2 || zh < 2) return null;
                  const style = zoneStyleFor(zone);
                  const isActive = zone.aisle === currentAisle;
                  return (
                    <Rect
                      key={`block-${idx}`}
                      x={wx}
                      y={wy}
                      width={zw}
                      height={zh}
                      fill={style.fill}
                      fillOpacity={style.fillOpacity}
                      stroke={isActive ? '#5a9a7a' : style.stroke}
                      strokeWidth={isActive ? 2.5 : 1}
                      rx={zone.kind === 'aisle' ? 2 : 4}
                    />
                  );
                })}

                {shelfStrips.map((strip, idx) => {
                  const { wx, wy } = toWorld(strip.x, strip.y);
                  return (
                    <Rect
                      key={`gondola-${idx}`}
                      x={wx}
                      y={wy}
                      width={strip.w * worldW}
                      height={strip.h * worldH}
                      fill={strip.endCap ? GONDOLA_STYLE.endCapFill : GONDOLA_STYLE.fill}
                      stroke={GONDOLA_STYLE.stroke}
                      strokeWidth={0.8}
                      rx={1.5}
                    />
                  );
                })}

                {showZoneLabels
                  ? buildingZones.map((zone, idx) => {
                      if (zone.rect.w < 0.035 && zone.rect.h < 0.035) return null;
                      const { wx, wy } = toWorld(
                        zone.rect.x + zone.rect.w / 2,
                        zone.rect.y + zone.rect.h / 2,
                      );
                      const style = zoneStyleFor(zone);
                      const emoji = zone.aisle ? getStoreAisleDefinition(zone.aisle).emoji : '';
                      const fontSize = Math.max(10, Math.min(16, 14 * (4 / zoomRatio)));
                      return (
                        <SvgText
                          key={`lbl-${idx}`}
                          x={wx}
                          y={wy + fontSize * 0.35}
                          fontSize={fontSize}
                          fill={style.text}
                          textAnchor="middle"
                          fontWeight="500"
                          opacity={0.88}
                        >
                          {`${emoji} ${zone.label}`}
                        </SvgText>
                      );
                    })
                  : null}

                {showRoute && polyline.length > 1 ? (
                  <>
                    <Polyline
                      points={routePoints}
                      fill="none"
                      stroke={ROUTE_STYLE.halo}
                      strokeWidth={routeWidth + 6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={ROUTE_STYLE.haloOpacity}
                    />
                    <Polyline
                      points={routePoints}
                      fill="none"
                      stroke={ROUTE_STYLE.line}
                      strokeWidth={routeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : null}

                {communityPins.map((pin, idx) => {
                  const { wx, wy } = toWorld(pin.x, pin.y);
                  return (
                    <Circle
                      key={`comm-${idx}`}
                      cx={wx}
                      cy={wy}
                      r={7}
                      fill="#e8a87c"
                      stroke="#c4784a"
                      strokeWidth={1.5}
                    />
                  );
                })}

                {itemPins.map((pin) => {
                  const { wx, wy } = toWorld(pin.x, pin.y);
                  return (
                    <G key={pin.id}>
                      <Circle
                        cx={wx}
                        cy={wy}
                        r={pin.highlighted ? 10 : 7}
                        fill={pin.highlighted ? '#8b6cb8' : '#a894c4'}
                        stroke="#6b508f"
                        strokeWidth={1.5}
                      />
                      {showItemLabels ? (
                        <SvgText
                          x={wx}
                          y={wy - 12}
                          fontSize={11}
                          fill="#5c4578"
                          textAnchor="middle"
                          fontWeight="500"
                        >
                          {pin.name.length > 14 ? `${pin.name.slice(0, 13)}…` : pin.name}
                        </SvgText>
                      ) : null}
                    </G>
                  );
                })}

                {activeNode ? (
                  <Circle
                    cx={toWorld(activeNode.x, activeNode.y).wx}
                    cy={toWorld(activeNode.x, activeNode.y).wy}
                    r={11}
                    fill="#5a9a7a"
                    stroke="#3d7a5c"
                    strokeWidth={2}
                  />
                ) : null}

                {(() => {
                  const entry = toWorld(layout.entry.x, layout.entry.y);
                  const userC = toWorld(user.x, user.y);
                  const secondary = layout.secondaryEntry
                    ? toWorld(layout.secondaryEntry.x, layout.secondaryEntry.y)
                    : null;
                  return (
                    <>
                      {showEntryLink ? (
                        <Line
                          x1={entry.wx}
                          y1={entry.wy}
                          x2={userC.wx}
                          y2={userC.wy}
                          stroke="#a39e96"
                          strokeWidth={1.5}
                          strokeDasharray="4,5"
                          opacity={0.7}
                        />
                      ) : null}
                      <Circle cx={userC.wx} cy={userC.wy} r={10} fill="#6b93c4" stroke="#4a6f9c" strokeWidth={2} />
                      <Circle
                        cx={userC.wx}
                        cy={userC.wy}
                        r={16}
                        fill="none"
                        stroke="#4a6f9c"
                        strokeWidth={1.5}
                        opacity={0.45}
                      />
                      <Circle cx={entry.wx} cy={entry.wy} r={7} fill="#d4726a" stroke="#b05550" strokeWidth={1.5} />
                      {showZoneLabels ? (
                        <SvgText
                          x={entry.wx}
                          y={entry.wy + 22}
                          fontSize={12}
                          fill="#6b6560"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          ENTRÉE
                        </SvgText>
                      ) : null}
                      {secondary ? (
                        <>
                          <Circle
                            cx={secondary.wx}
                            cy={secondary.wy}
                            r={6}
                            fill="#d4a06a"
                            stroke="#b07d42"
                            strokeWidth={1.5}
                          />
                          {showZoneLabels ? (
                            <SvgText
                              x={secondary.wx}
                              y={secondary.wy + 18}
                              fontSize={10}
                              fill="#8a6b42"
                              textAnchor="middle"
                              fontWeight="500"
                            >
                              {layout.secondaryEntry?.label ?? 'ENTRÉE 2'}
                            </SvgText>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  );
                })()}

                {layoutBadge ? (
                  <SvgText x={10} y={20} fontSize={14} fill="#5c574f" fontWeight="600" opacity={0.9}>
                    {layoutBadge}
                  </SvgText>
                ) : null}

                <Rect x={10} y={worldH - 32} width={scaleBarWorld} height={5} fill="#8a8278" rx={1.5} />
                <SvgText x={10} y={worldH - 12} fontSize={11} fill="#8a8278" fontWeight="500">
                  {scaleBarMeters} m
                </SvgText>
              </Svg>
            </View>
          </GestureDetector>
        ) : null}

        <Pressable
          onPress={centerOnUser}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white border border-ink-200 items-center justify-center shadow-sm"
          accessibilityLabel={centerOnMeLabel}
          style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
        >
          <Text className="text-lg">◎</Text>
        </Pressable>
      </View>

      {mapLegend ? (
        <Text className="text-xs text-ink-400 text-center py-1 px-2">{mapLegend}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapSlot: {
    flex: 1,
    width: '100%',
    minHeight: 280,
  },
  mapFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
