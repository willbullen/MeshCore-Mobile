import { router } from "expo-router";
import { useState, useCallback } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ConnectionStatusBanner } from "@/components/connection-status-banner";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNodes } from "@/hooks/use-nodes";
import { nodeService } from "@/lib/node-service";
import type { StoredNode } from "@/lib/storage-service";
import {
  formatRelativeTime,
  getNodeTypeIcon,
  getStatusColor,
  getSignalStrength,
} from "@/constants/mock-data";

export default function NodesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Nodes hook
  const [nodesState, nodesActions] = useNodes();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await nodesActions.refreshNodes();
    setRefreshing(false);
  }, [nodesActions]);

  const handleNodePress = (node: StoredNode) => {
    router.push({
      pathname: "/node-detail" as any,
      params: { nodeHash: node.nodeHash },
    });
  };

  // Memoize node item render function
  const renderNode = useCallback(({ item }: { item: StoredNode }) => {
    const statusColor = getStatusColor(item.isOnline);
    const batteryColor = item.batteryLevel ? nodeService.getBatteryColor(item.batteryLevel) : colors.textSecondary;
    const signalStrength = item.rssi ? getSignalStrength(item.rssi) : 'N/A';
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.nodeCard,
          { backgroundColor: colors.surface },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => handleNodePress(item)}
      >
        {/* Node Icon */}
        <View style={[styles.nodeIcon, { backgroundColor: colors.primary }]}>
          <IconSymbol
            name={getNodeTypeIcon(item.nodeType) as any}
            size={28}
            color="#ffffff"
          />
          {/* Online status indicator */}
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor, borderColor: colors.surface },
            ]}
          />
        </View>

        {/* Node Info */}
        <View style={styles.nodeContent}>
          <View style={styles.nodeHeader}>
            <ThemedText type="defaultSemiBold" style={styles.nodeName}>
              {item.name}
            </ThemedText>
            <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
              <ThemedText style={[styles.typeText, { color: colors.accent }]}>
                {item.nodeType}
              </ThemedText>
            </View>
          </View>

          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Battery */}
            {item.batteryLevel !== undefined && (
              <View style={styles.metric}>
                <IconSymbol name="battery.100" size={16} color={batteryColor} />
                <ThemedText style={[styles.metricText, { color: colors.textSecondary }]}>
                  {item.batteryLevel}%
                </ThemedText>
              </View>
            )}

            {/* Signal */}
            {item.rssi !== undefined && (
              <View style={styles.metric}>
                <IconSymbol name="wifi" size={16} color={colors.textSecondary} />
                <ThemedText style={[styles.metricText, { color: colors.textSecondary }]}>
                  {signalStrength}
                </ThemedText>
              </View>
            )}

            {/* Last Seen */}
            <View style={styles.metric}>
              <ThemedText style={[styles.metricText, { color: colors.textSecondary }]}>
                {item.isOnline ? "Online" : formatRelativeTime(new Date(item.lastSeen))}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
      </Pressable>
    );
  }, [colors, handleNodePress]);
  
  // Memoized key extractor
  const keyExtractor = useCallback((item: StoredNode) => item.nodeHash, []);

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
        <ThemedText type="title">Nodes</ThemedText>
        <View style={styles.headerStats}>
          <ThemedText style={[styles.statsText, { color: colors.success }]}>
            {nodesState.onlineCount} online
          </ThemedText>
          <ThemedText style={[styles.statsText, { color: colors.textSecondary }]}>
            {nodesState.nodes.length} total
          </ThemedText>
        </View>
      </View>

      {/* Nodes List */}
      <FlatList
        data={nodesState.nodes}
        renderItem={renderNode}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          nodesState.isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary, marginTop: Spacing.lg }]}>
                Loading nodes...
              </ThemedText>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                name="antenna.radiowaves.left.and.right"
                size={64}
                color={colors.textSecondary}
              />
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No nodes discovered
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: colors.textDisabled }]}>
                Nodes will appear here when they join the network
              </ThemedText>
            </View>
          )
        }
      />
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
  },
  headerStats: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: Spacing.lg,
  },
  nodeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  nodeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  nodeContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  nodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  nodeName: {
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 13,
  },
  separator: {
    height: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
