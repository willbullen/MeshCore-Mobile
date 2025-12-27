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

// Try to import expo-maps, fall back to null if not available
let GoogleMaps: any = null;
let AppleMaps: any = null;
let MAPS_AVAILABLE = false;

try {
  const maps = require("expo-maps");
  GoogleMaps = maps.GoogleMaps;
  AppleMaps = maps.AppleMaps;
  MAPS_AVAILABLE = true;
} catch (error) {
  console.warn("[Maps] expo-maps not available. Showing fallback UI.");
}

// Use platform-specific map component if available
const MapView = MAPS_AVAILABLE
  ? Platform.OS === "ios"
    ? AppleMaps?.View
    : GoogleMaps?.View
  : null;

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

  // Fallback UI when maps are not available
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
              Map requires development build
            </ThemedText>
            <ThemedText
              style={[
                styles.fallbackText,
                { color: colors.textSecondary, textAlign: "center" },
              ]}
            >
              expo-maps requires native modules that aren't available in Expo Go. To use the map
              feature, create a development build.
            </ThemedText>
            <Pressable
              style={[styles.fallbackButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                // Open Expo docs
                console.log("Open development build docs");
              }}
            >
              <ThemedText style={styles.fallbackButtonText}>
                Learn about development builds
              </ThemedText>
            </Pressable>
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

  // Normal map UI when maps are available
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
  fallbackButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  fallbackButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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
