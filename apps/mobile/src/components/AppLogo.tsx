import { HomesharedLogo } from '@/components/HomesharedLogo';

interface AppLogoProps {
  size?: number;
}

/** Logo homeshared (écrans auth, download) — délègue à HomesharedLogo. */
export function AppLogo({ size = 72 }: AppLogoProps) {
  return <HomesharedLogo pixelSize={size} interactive={false} tone="onLight" />;
}
