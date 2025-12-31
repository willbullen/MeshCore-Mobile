/**
 * Native-only MapView component
 * This file uses .native.tsx extension so Metro only bundles it for iOS/Android
 * Web builds will automatically skip this file
 */
import { Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, type Region } from "react-native-maps";

export interface NativeMapViewProps {
  initialRegion: Region;
  onMapReady: () => void;
  nodes: Array<{
    nodeHash: string;
    name: string;
    latitude: number;
    longitude: number;
    nodeType: string;
    isOnline: boolean;
  }>;
  colors: {
    success: string;
    textDisabled: string;
  };
  onMarkerPress: (latitude: number, longitude: number) => void;
}

export function NativeMapView({
  initialRegion,
  onMapReady,
  nodes,
  colors,
  onMarkerPress,
}: NativeMapViewProps) {
  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

  return (
    <MapView
      provider={mapProvider}
      style={{ flex: 1 }}
      initialRegion={initialRegion}
      onMapReady={onMapReady}
      showsUserLocation={true}
      showsMyLocationButton={true}
      mapType="standard"
    >
      {nodes.map((node) => (
        <Marker
          key={node.nodeHash}
          coordinate={{
            latitude: node.latitude,
            longitude: node.longitude,
          }}
          title={node.name}
          description={`${node.nodeType} • ${node.isOnline ? 'Online' : 'Offline'}`}
          pinColor={node.isOnline ? colors.success : colors.textDisabled}
          onPress={() => {
            onMarkerPress(node.latitude, node.longitude);
          }}
        />
      ))}
    </MapView>
  );
}
