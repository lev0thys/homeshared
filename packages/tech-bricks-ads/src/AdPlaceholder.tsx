import { View, Text } from 'react-native';
import type { AdPlacement } from './types';

interface AdPlaceholderProps {
  placement: AdPlacement;
  hint?: string;
}

export function AdPlaceholder({ placement, hint }: AdPlaceholderProps) {
  return (
    <View
      accessibilityLabel={`Bannière publicitaire (${placement})`}
      style={{
        height: 50,
        backgroundColor: '#f1f5f9',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
      }}
    >
      <Text style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
        {hint ?? 'Publicité'} · {placement}
      </Text>
    </View>
  );
}
