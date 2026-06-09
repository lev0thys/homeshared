import { StyleSheet } from 'react-native';

// Extension NativeWind (non typée dans RN standard).
const sheet = StyleSheet as typeof StyleSheet & {
  setFlag?: (name: string, value: string) => void;
};
sheet.setFlag?.('darkMode', 'class');
