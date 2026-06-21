import { View } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import {
  buildGondolaStripsInZone,
  getCorridorStyle,
  getShopZoneStyle,
  getFloorZoneStyle,
  GONDOLA_STYLE,
  MAP_PAPER,
  getStoreLayout,
  type StoreLayoutProfileId,
} from '@homeshared/store-navigation';

interface StoreLayoutPreviewProps {
  profile: StoreLayoutProfileId;
  width?: number;
  height?: number;
  active?: boolean;
}

/** Miniature cartographique du plan. */
export function StoreLayoutPreview({
  profile,
  width = 88,
  height = 56,
  active = false,
}: StoreLayoutPreviewProps) {
  const layout = getStoreLayout(profile);
  const pad = 4;
  const mapW = width - pad * 2;
  const mapH = height - pad * 2;
  const toPx = (x: number, y: number) => ({ px: pad + x * mapW, py: pad + y * mapH });

  const corridors = layout.zones.filter((z) => z.kind === 'corridor');
  const buildings = layout.zones.filter((z) => z.kind !== 'corridor');
  const gondolas = layout.zones.flatMap((z) => buildGondolaStripsInZone(z, profile));

  return (
    <View
      className={`rounded-lg overflow-hidden border ${active ? 'border-emerald-500' : 'border-ink-200'}`}
    >
      <Svg width={width} height={height}>
        <Rect x={pad} y={pad} width={mapW} height={mapH} fill={MAP_PAPER.background} rx={3} />

        {corridors.map((zone, idx) => {
          const { px, py } = toPx(zone.rect.x, zone.rect.y);
          const style = getCorridorStyle(zone.label);
          return (
            <Rect
              key={`c-${idx}`}
              x={px}
              y={py}
              width={zone.rect.w * mapW}
              height={zone.rect.h * mapH}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={0.4}
            />
          );
        })}

        {buildings.map((zone, idx) => {
          const { px, py } = toPx(zone.rect.x, zone.rect.y);
          const zw = zone.rect.w * mapW;
          const zh = zone.rect.h * mapH;
          if (zw < 1 || zh < 1) return null;
          const style =
            zone.kind === 'shop' ? getShopZoneStyle(zone.label) : getFloorZoneStyle(zone.kind);
          return (
            <Rect
              key={`b-${idx}`}
              x={px}
              y={py}
              width={zw}
              height={zh}
              fill={style.fill}
              fillOpacity={style.fillOpacity}
              stroke={style.stroke}
              strokeWidth={0.4}
            />
          );
        })}

        {gondolas.map((strip, idx) => {
          const { px, py } = toPx(strip.x, strip.y);
          return (
            <Rect
              key={`g-${idx}`}
              x={px}
              y={py}
              width={strip.w * mapW}
              height={strip.h * mapH}
              fill={GONDOLA_STYLE.fill}
              stroke={GONDOLA_STYLE.stroke}
              strokeWidth={0.3}
            />
          );
        })}

        {(() => {
          const { px, py } = toPx(layout.entry.x, layout.entry.y);
          return <Circle cx={px} cy={py} r={2} fill="#d4726a" />;
        })()}
        <SvgText x={width / 2} y={height - 1} fontSize={6} fill="#8a8278" textAnchor="middle">
          {profile.replace('_FR', '')}
        </SvgText>
      </Svg>
    </View>
  );
}
