import { useState, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import native map component - Metro will use .native.tsx for iOS/Android and .web.tsx for web
import { NativeMapView } from "@/components/native-map-view";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ConnectionStatusBanner } from "@/components/connection-status-banner";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  type Node,
} from "@/constants/mock-data";

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const [mapReady, setMapReady] = useState(false);

  // Filter nodes with location data
  const nodesWithLocation = mockNodes.filter((n) => n.latitude && n.longitude);

  // Calculate initial region to show all nodes
  const initialRegion = useMemo<Region>(() => {
    if (nodesWithLocation.length === 0) {
      // Default to San Francisco if no nodes
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const latitudes = nodesWithLocation.map((n) => n.latitude!);
    const longitudes = nodesWithLocation.map((n) => n.longitude!);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.01;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }, [nodesWithLocation]);


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

      {/* Map View */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          // Web fallback - show message and list
          <View style={styles.webFallback}>
            <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
            <ThemedText type="subtitle" style={{ textAlign: "center", marginTop: Spacing.md }}>
              Map View
            </ThemedText>
            <ThemedText
              style={[
                styles.fallbackText,
                { color: colors.textSecondary, textAlign: "center" },
              ]}
            >
              Interactive maps are available in native builds. View node locations below or open in Google Maps.
            </ThemedText>
            {nodesWithLocation.length > 0 && (
              <View style={styles.webMapLinks}>
                {nodesWithLocation.map((node) => (
                  <Pressable
                    key={node.nodeHash}
                    style={[styles.webMapLink, { backgroundColor: colors.surface }]}
                    onPress={() => {
                      const url = `https://www.google.com/maps?q=${node.latitude},${node.longitude}`;
                      Linking.openURL(url).catch((err) =>
                        console.error('Failed to open maps:', err)
                      );
                    }}
                  >
                    <ThemedText type="defaultSemiBold">{node.name}</ThemedText>
                    <ThemedText style={[styles.coordinates, { color: colors.textSecondary }]}>
                      {node.latitude?.toFixed(6)}, {node.longitude?.toFixed(6)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : Platform.OS !== 'web' ? (
          // Native map view (iOS/Android)
          <>
            {!mapReady && (
              <View style={styles.mapLoading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <ThemedText style={{ marginTop: Spacing.md, color: colors.textSecondary }}>
                  Loading map...
                </ThemedText>
              </View>
            )}
            <NativeMapView
              initialRegion={initialRegion}
              onMapReady={() => setMapReady(true)}
              nodes={nodesWithLocation.map((node) => ({
                nodeHash: node.nodeHash,
                name: node.name,
                latitude: node.latitude!,
                longitude: node.longitude!,
                nodeType: node.nodeType,
                isOnline: node.isOnline,
              }))}
              colors={{
                success: colors.success,
                textDisabled: colors.textDisabled,
              }}
              onMarkerPress={(latitude, longitude) => {
                // Open in maps app for more details
                const url = Platform.select({
                  ios: `maps://maps.apple.com/?q=${latitude},${longitude}`,
                  android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
                });
                if (url) {
                  Linking.openURL(url).catch((err) =>
                    console.error('Failed to open maps:', err)
                  );
                }
              }}
            />
          </>
        ) : (
          // Fallback if MapView not available (e.g., in Expo Go)
          <View style={styles.webFallback}>
            <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
            <ThemedText type="subtitle" style={{ textAlign: "center", marginTop: Spacing.md }}>
              Map View
            </ThemedText>
            <ThemedText
              style={[
                styles.fallbackText,
                { color: colors.textSecondary, textAlign: "center" },
              ]}
            >
              Interactive maps require a development build. View node locations below.
            </ThemedText>
          </View>
        )}
      </View>

      {/* Node List (Collapsible) */}
      {nodesWithLocation.length > 0 && (
        <ScrollView
          style={[styles.nodeListContainer, { backgroundColor: colors.surface }]}
          contentContainerStyle={styles.nodeListContent}
        >
          <ThemedText type="subtitle" style={{ marginBottom: Spacing.md }}>
            Nodes ({nodesWithLocation.length})
          </ThemedText>
          {nodesWithLocation.map((node) => (
            <Pressable
              key={node.nodeHash}
              style={[styles.nodeItem, { backgroundColor: colors.background }]}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps://maps.apple.com/?q=${node.latitude},${node.longitude}`,
                  android: `geo:${node.latitude},${node.longitude}?q=${node.latitude},${node.longitude}`,
                });
                if (url) {
                  Linking.openURL(url).catch((err) =>
                    console.error('Failed to open maps:', err)
                  );
                }
              }}
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
              <ThemedText style={[styles.tapHint, { color: colors.primary }]}>
                Tap to open in Maps
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}
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
    zIndex: 10,
  },
  nodeCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
  nodeListContainer: {
    maxHeight: 200,
    borderTopWidth: 1,
  },
  nodeListContent: {
    padding: Spacing.lg,
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
    marginBottom: Spacing.xs,
  },
  tapHint: {
    fontSize: 12,
    fontWeight: "500",
  },
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  fallbackText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.sm,
    maxWidth: 300,
  },
  webMapLinks: {
    marginTop: Spacing.lg,
    width: "100%",
    maxWidth: 400,
  },
  webMapLink: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
});
