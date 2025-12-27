import { useState, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE, Region, Callout } from "react-native-maps";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  getStatusColor,
  getBatteryColor,
  type Node,
} from "@/constants/mock-data";

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // Filter nodes with location data
  const nodesWithLocation = mockNodes.filter((n) => n.latitude && n.longitude);

  // Calculate initial region (center on San Francisco)
  const [region] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleCenterOnUser = () => {
    // Center on the first node (Base Station)
    const baseStation = mockNodes[0];
    if (baseStation.latitude && baseStation.longitude) {
      mapRef.current?.animateToRegion({
        latitude: baseStation.latitude,
        longitude: baseStation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const renderMarker = (node: Node) => {
    if (!node.latitude || !node.longitude) return null;

    const statusColor = getStatusColor(node.isOnline);
    const batteryColor = getBatteryColor(node.batteryLevel);

    return (
      <Marker
        key={node.nodeHash}
        coordinate={{
          latitude: node.latitude,
          longitude: node.longitude,
        }}
        pinColor={node.isOnline ? "#22c55e" : "#64748b"}
        title={node.name}
        description={`${node.nodeType} • ${node.isOnline ? "Online" : "Offline"}`}
      >
        <Callout tooltip>
          <View style={[styles.callout, { backgroundColor: colors.surface }]}>
            <View style={styles.calloutHeader}>
              <ThemedText type="defaultSemiBold">{node.name}</ThemedText>
              <View
                style={[
                  styles.calloutStatusDot,
                  { backgroundColor: statusColor },
                ]}
              />
            </View>
            
            <View style={[styles.calloutDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.calloutMetrics}>
              <View style={styles.calloutMetric}>
                <ThemedText style={[styles.calloutLabel, { color: colors.textSecondary }]}>
                  Type
                </ThemedText>
                <ThemedText style={styles.calloutValue}>{node.nodeType}</ThemedText>
              </View>
              
              {node.batteryLevel !== undefined && (
                <View style={styles.calloutMetric}>
                  <ThemedText style={[styles.calloutLabel, { color: colors.textSecondary }]}>
                    Battery
                  </ThemedText>
                  <ThemedText style={[styles.calloutValue, { color: batteryColor }]}>
                    {node.batteryLevel}%
                  </ThemedText>
                </View>
              )}
              
              {node.rssi !== undefined && (
                <View style={styles.calloutMetric}>
                  <ThemedText style={[styles.calloutLabel, { color: colors.textSecondary }]}>
                    Signal
                  </ThemedText>
                  <ThemedText style={styles.calloutValue}>{node.rssi} dBm</ThemedText>
                </View>
              )}
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ThemedText type="title">Map</ThemedText>
        <ThemedText style={[styles.nodeCount, { color: colors.success }]}>
          {nodesWithLocation.length} nodes
        </ThemedText>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        customMapStyle={colorScheme === "dark" ? darkMapStyle : []}
      >
        {nodesWithLocation.map(renderMarker)}
      </MapView>

      {/* Center on User Button */}
      <Pressable
        style={({ pressed }) => [
          styles.centerButton,
          {
            backgroundColor: colors.surface,
            bottom: insets.bottom + 24,
            right: Spacing.lg,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleCenterOnUser}
      >
        <IconSymbol name="location.fill" size={24} color={colors.primary} />
      </Pressable>

      {/* Legend */}
      <View
        style={[
          styles.legend,
          {
            backgroundColor: colors.surface,
            bottom: insets.bottom + 24,
            left: Spacing.lg,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
          <ThemedText style={styles.legendText}>Online</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#64748b" }]} />
          <ThemedText style={styles.legendText}>Offline</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

// Dark map style for better visibility
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  nodeCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  legend: {
    position: "absolute",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
  },
  callout: {
    width: 200,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  calloutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calloutStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  calloutDivider: {
    height: 1,
  },
  calloutMetrics: {
    gap: Spacing.xs,
  },
  calloutMetric: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calloutLabel: {
    fontSize: 13,
  },
  calloutValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
