import Svg, { Ellipse, Path } from 'react-native-svg';

interface HomesharedLogoMarkProps {
  size: number;
  /** Header sombre vs écrans clairs (login). */
  tone?: 'onDark' | 'onLight';
}

/**
 * Logo vectoriel maison + maillon(s) centrés — fond transparent.
 */
export function HomesharedLogoMark({ size, tone = 'onLight' }: HomesharedLogoMarkProps) {
  const primary = tone === 'onDark' ? '#93c5fd' : '#2563eb';
  const accent = tone === 'onDark' ? '#e0f2fe' : '#38bdf8';
  const stroke = 2.4;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Maison fermée — intérieur libre pour le symbole lien */}
      <Path
        d="M10 37.5V22.5L24 9.5 38 22.5V37.5H10Z"
        stroke={primary}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M31 13.5V9"
        stroke={primary}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Maillons centrés dans la maison (lien / partage) */}
      <Ellipse
        cx="20.5"
        cy="30"
        rx="5"
        ry="3.5"
        stroke={accent}
        strokeWidth={stroke}
      />
      <Ellipse
        cx="27.5"
        cy="30"
        rx="5"
        ry="3.5"
        stroke={primary}
        strokeWidth={stroke}
      />
    </Svg>
  );
}
