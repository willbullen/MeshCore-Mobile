import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  Linking,
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
  type Node,
} from "@/constants/mock-data";

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();

  // Filter nodes with location data
  const nodesWithLocation = mockNodes.filter((n) => n.latitude && n.longitude);

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

      {/* Content */}
      <ScrollView
        style={styles.fallbackContainer}
        contentContainerStyle={styles.fallbackContent}
      >
        <View style={styles.fallbackMessage}>
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
            Interactive map will be available in the production iOS build. For now, view node locations below.
          </ThemedText>
        </View>

        {/* Show node list */}
        <View style={styles.nodeList}>
          <ThemedText type="subtitle" style={{ marginBottom: Spacing.md }}>
            Nodes with Location
          </ThemedText>
          {nodesWithLocation.map((node) => (
            <Pressable
              key={node.nodeHash}
              style={[styles.nodeItem, { backgroundColor: colors.surface }]}
              onPress={() => {
                // Open in maps app
                const url = `https://maps.google.com/?q=${node.latitude},${node.longitude}`;
                Linking.openURL(url);
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
        </View>
      </ScrollView>
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
    marginBottom: Spacing.xs,
  },
  tapHint: {
    fontSize: 12,
    fontWeight: "500",
  },
});
