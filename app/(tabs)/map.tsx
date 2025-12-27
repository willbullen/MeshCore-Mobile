import { useState, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ConnectionStatusBanner } from "@/components/connection-status-banner";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  getStatusColor,
  type Node,
} from "@/constants/mock-data";

// Only import react-native-maps on native platforms (not web)
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;
const MAPS_AVAILABLE = Platform.OS !== "web";

if (MAPS_AVAILABLE) {
  try {
    const maps = require("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
    PROVIDER_DEFAULT = maps.PROVIDER_DEFAULT;
  } catch (error) {
    console.warn("[Maps] react-native-maps not available:", error);
  }
}

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  // Filter nodes with location data
  const nodesWithLocation = mockNodes.filter((n) => n.latitude && n.longitude);

  // Calculate initial region (center on San Francisco)
  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleCenterOnUser = () => {
    // Center on the first node (Base Station)
    const baseStation = mockNodes[0];
    if (baseStation.latitude && baseStation.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: baseStation.latitude,
        longitude: baseStation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Fallback UI when maps are not available (web or Expo Go)
  if (!MAPS_AVAILABLE || !MapView) {
    return (
      <ThemedView style={styles.container}>
        <ConnectionStatusBanner />
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

        {/* Fallback Content */}
        <ScrollView
          style={styles.fallbackContainer}
          contentContainerStyle={styles.fallbackContent}
        >
          <View style={styles.fallbackMessage}>
            <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
            <ThemedText type="subtitle" style={{ textAlign: "center", marginTop: Spacing.md }}>
              Map requires native build
            </ThemedText>
            <ThemedText
              style={[
                styles.fallbackText,
                { color: colors.textSecondary, textAlign: "center" },
              ]}
            >
              The map feature requires a native iOS/Android build and won't work on web or in Expo Go. Create a development build to use the map.
            </ThemedText>
          </View>

          {/* Show node list as fallback */}
          <View style={styles.nodeList}>
            <ThemedText type="subtitle" style={{ marginBottom: Spacing.md }}>
              Nodes with Location
            </ThemedText>
            {nodesWithLocation.map((node) => (
              <View
                key={node.nodeHash}
                style={[styles.nodeItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.nodeItemHeader}>
                  <ThemedText type="defaultSemiBold">{node.name}</ThemedText>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: node.isOnline ? colors.success : colors.textDisabled },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.coordinates, { color: colors.textSecondary }]}>
                  {node.latitude?.toFixed(6)}, {node.longitude?.toFixed(6)}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // Normal map UI when maps are available (native platforms)
  return (
    <ThemedView style={styles.container}>
      <ConnectionStatusBanner />
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
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {nodesWithLocation.map((node) => (
          <Marker
            key={node.nodeHash}
            coordinate={{
              latitude: node.latitude!,
              longitude: node.longitude!,
            }}
            title={node.name}
            description={`${node.isOnline ? "Online" : "Offline"}`}
            pinColor={node.isOnline ? "#22c55e" : "#64748b"}
          />
        ))}
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
  fallbackContainer: {
    flex: 1,
  },
  fallbackContent: {
    padding: Spacing.lg,
  },
  fallbackMessage: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
  },
  fallbackText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.sm,
    maxWidth: 300,
  },
  nodeList: {
    marginTop: Spacing.lg,
  },
  nodeItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  nodeItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  coordinates: {
    fontSize: 13,
  },
});
