import * as Location from 'expo-location';

export interface ForegroundCoords {
  lat: number;
  lon: number;
  accuracyMeters?: number;
}

export async function requestForegroundLocation(): Promise<ForegroundCoords> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('LOCATION_DENIED');
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    accuracyMeters: pos.coords.accuracy ?? undefined,
  };
}
