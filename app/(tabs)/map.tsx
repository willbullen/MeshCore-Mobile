import { useState, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoogleMaps, AppleMaps } from "expo-maps";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  getStatusColor,
  type Node,
} from "@/constants/mock-data";

// Use platform-specific map component
const MapView = Platform.OS === "ios" ? AppleMaps.View : GoogleMaps.View;

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  // Filter nodes with location data
  const nodesWithLocation = mockNodes.filter((n) => n.latitude && n.longitude);

  // Calculate initial camera position (center on San Francisco)
  const initialCameraPosition = {
    center: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    zoom: 14,
  };

  const handleCenterOnUser = () => {
    // Center on the first node (Base Station)
    const baseStation = mockNodes[0];
    if (baseStation.latitude && baseStation.longitude && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: baseStation.latitude,
          longitude: baseStation.longitude,
        },
        zoom: 15,
      });
    }
  };

  // Create markers array for the map
  const markers = nodesWithLocation.map((node) => ({
    id: node.nodeHash,
    coordinate: {
      latitude: node.latitude!,
      longitude: node.longitude!,
    },
    title: node.name,
    color: node.isOnline ? "#22c55e" : "#64748b",
  }));

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
        cameraPosition={initialCameraPosition}
        markers={markers}
      />

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
});
