/**
 * Web fallback for native-map-view
 * This file is used when building for web
 * Metro will automatically use this instead of .native.tsx on web
 */
import { View } from "react-native";

export interface NativeMapViewProps {
  initialRegion: any;
  onMapReady: () => void;
  nodes: Array<any>;
  colors: {
    success: string;
    textDisabled: string;
  };
  onMarkerPress: (latitude: number, longitude: number) => void;
}

export function NativeMapView(_props: NativeMapViewProps) {
  // Return null on web - the parent component will show a fallback
  return null;
}
