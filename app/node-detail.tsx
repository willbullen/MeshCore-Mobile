import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  formatRelativeTime,
  getNodeTypeIcon,
  getStatusColor,
  getBatteryColor,
  getSignalStrength,
} from "@/constants/mock-data";

export default function NodeDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const { nodeHash } = useLocalSearchParams<{ nodeHash: string }>();
  
  const node = mockNodes.find((n) => n.nodeHash === nodeHash);

  if (!node) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Node not found</ThemedText>
      </ThemedView>
    );
  }

  const statusColor = getStatusColor(node.isOnline);
  const batteryColor = getBatteryColor(node.batteryLevel);
  const signalStrength = getSignalStrength(node.rssi);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, 20),
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <ThemedText type="defaultSemiBold">Node Details</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
            <IconSymbol
              name={getNodeTypeIcon(node.nodeType) as any}
              size={48}
              color="#ffffff"
            />
            <View
              style={[
                styles.heroStatusDot,
                { backgroundColor: statusColor, borderColor: colors.surface },
              ]}
            />
          </View>
          <ThemedText type="title" style={styles.heroName}>
            {node.name}
          </ThemedText>
          <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.typeText, { color: colors.accent }]}>
              {node.nodeType}
            </ThemedText>
          </View>
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {node.isOnline ? "● Online" : "● Offline"}
          </ThemedText>
        </View>

        {/* Metrics Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Metrics
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {/* Battery */}
            {node.batteryLevel !== undefined && (
              <View style={styles.metricRow}>
                <View style={styles.metricLabel}>
                  <IconSymbol name="battery.100" size={20} color={batteryColor} />
                  <ThemedText style={styles.metricLabelText}>Battery Level</ThemedText>
                </View>
                <ThemedText type="defaultSemiBold" style={{ color: batteryColor }}>
                  {node.batteryLevel}%
                </ThemedText>
              </View>
            )}

            {/* Signal Strength */}
            {node.rssi !== undefined && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.metricRow}>
                  <View style={styles.metricLabel}>
                    <IconSymbol name="wifi" size={20} color={colors.textSecondary} />
                    <ThemedText style={styles.metricLabelText}>Signal Strength</ThemedText>
                  </View>
                  <View style={styles.metricValue}>
                    <ThemedText type="defaultSemiBold">{signalStrength}</ThemedText>
                    <ThemedText style={[styles.metricSubtext, { color: colors.textSecondary }]}>
                      {node.rssi} dBm
                    </ThemedText>
                  </View>
                </View>
              </>
            )}

            {/* SNR */}
            {node.snr !== undefined && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.metricRow}>
                  <View style={styles.metricLabel}>
                    <IconSymbol name="antenna.radiowaves.left.and.right" size={20} color={colors.textSecondary} />
                    <ThemedText style={styles.metricLabelText}>SNR</ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold">{node.snr} dB</ThemedText>
                </View>
              </>
            )}

            {/* Last Seen */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.metricRow}>
              <View style={styles.metricLabel}>
                <IconSymbol name="info.circle.fill" size={20} color={colors.textSecondary} />
                <ThemedText style={styles.metricLabelText}>Last Seen</ThemedText>
              </View>
              <ThemedText type="defaultSemiBold">
                {node.isOnline ? "Now" : formatRelativeTime(node.lastSeen)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Location Section */}
        {node.latitude && node.longitude && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Location
            </ThemedText>
            
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.locationRow}>
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
                <View style={styles.locationContent}>
                  <ThemedText type="defaultSemiBold">Coordinates</ThemedText>
                  <ThemedText style={[styles.coordinates, { color: colors.textSecondary }]}>
                    {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                  </ThemedText>
                </View>
              </View>
              
              <Pressable
                style={({ pressed }) => [
                  styles.viewMapButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => {
                  // TODO: Navigate to map tab and center on this node
                }}
              >
                <ThemedText style={styles.viewMapButtonText}>View on Map</ThemedText>
                <IconSymbol name="map.fill" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Actions Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Actions
          </ThemedText>
          
          <View style={styles.actionsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                router.push({
                  pathname: "/chat" as any,
                  params: { nodeHash: node.nodeHash },
                });
              }}
            >
              <IconSymbol name="message.fill" size={24} color={colors.primary} />
              <ThemedText style={styles.actionButtonText}>Send Message</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                // TODO: Request position update
              }}
            >
              <IconSymbol name="location.fill" size={24} color={colors.primary} />
              <ThemedText style={styles.actionButtonText}>Request Position</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heroStatusDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  heroName: {
    textAlign: "center",
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  metricLabelText: {
    fontSize: 16,
  },
  metricValue: {
    alignItems: "flex-end",
  },
  metricSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  locationRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  locationContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  coordinates: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  viewMapButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  viewMapButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
