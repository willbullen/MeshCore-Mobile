import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConnectionStatusBanner } from "@/components/connection-status-banner";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBluetooth } from "@/hooks/use-bluetooth";
import { mockNodes, mockMessages, formatRelativeTime } from "@/constants/mock-data";

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [bluetoothState] = useBluetooth();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate metrics
  const onlineNodes = mockNodes.filter((n) => n.isOnline).length;
  const totalNodes = mockNodes.length;
  const recentMessages = mockMessages.slice(0, 5);
  const avgBattery = Math.round(
    mockNodes.reduce((sum, n) => sum + (n.batteryLevel || 0), 0) / mockNodes.length
  );
  const networkHealth = onlineNodes / totalNodes;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getHealthColor = () => {
    if (networkHealth >= 0.7) return colors.success;
    if (networkHealth >= 0.4) return colors.warning;
    return colors.error;
  };

  const getHealthStatus = () => {
    if (networkHealth >= 0.7) return "Excellent";
    if (networkHealth >= 0.4) return "Fair";
    return "Poor";
  };

  return (
    <ThemedView style={styles.container}>
      <ConnectionStatusBanner />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Dashboard</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Network Overview
          </ThemedText>
        </View>

        {/* Network Health Card */}
        <ThemedView
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Network Health</ThemedText>
            <View
              style={[
                styles.healthBadge,
                { backgroundColor: getHealthColor() + "20" },
              ]}
            >
              <ThemedText
                style={[styles.healthText, { color: getHealthColor() }]}
              >
                {getHealthStatus()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.healthBar}>
            <View
              style={[
                styles.healthFill,
                {
                  width: `${networkHealth * 100}%`,
                  backgroundColor: getHealthColor(),
                },
              ]}
            />
          </View>

          <View style={styles.healthStats}>
            <View style={styles.healthStat}>
              <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>
                Online Nodes
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                {onlineNodes}/{totalNodes}
              </ThemedText>
            </View>
            <View style={styles.healthStat}>
              <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>
                Avg Battery
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                {avgBattery}%
              </ThemedText>
            </View>
            <View style={styles.healthStat}>
              <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>
                Messages Today
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
                {mockMessages.length}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/" as any)}
          >
            <IconSymbol name="message.fill" size={24} color="#fff" />
            <ThemedText style={[styles.actionText, { color: "#fff" }]}>
              Messages
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/nodes")}
          >
            <IconSymbol name="antenna.radiowaves.left.and.right" size={24} color="#fff" />
            <ThemedText style={[styles.actionText, { color: "#fff" }]}>
              Nodes
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/map")}
          >
            <IconSymbol name="map.fill" size={24} color="#fff" />
            <ThemedText style={[styles.actionText, { color: "#fff" }]}>
              Map
            </ThemedText>
          </Pressable>
        </View>

        {/* Recent Activity */}
        <ThemedView
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <Pressable onPress={() => router.push("/" as any)}>
              <ThemedText style={{ color: colors.primary, fontSize: 14 }}>
                View All
              </ThemedText>
            </Pressable>
          </View>

          {recentMessages.map((message, index) => (
            <Pressable
              key={message.id}
              style={[
                styles.activityItem,
                index < recentMessages.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: { nodeHash: message.sender.nodeHash },
                })
              }
            >
              <View style={styles.activityLeft}>
                <View
                  style={[
                    styles.activityAvatar,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <ThemedText style={{ color: colors.primary, fontSize: 16 }}>
                    {message.sender.name.charAt(0)}
                  </ThemedText>
                </View>
                <View style={styles.activityInfo}>
                  <ThemedText type="defaultSemiBold">
                    {message.sender.name}
                  </ThemedText>
                  <ThemedText
                    style={{ color: colors.textSecondary, fontSize: 13 }}
                    numberOfLines={1}
                  >
                    {message.content}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>
                {formatRelativeTime(message.timestamp)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        {/* Node Status */}
        <ThemedView
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Node Status</ThemedText>
            <Pressable onPress={() => router.push("/(tabs)/nodes")}>
              <ThemedText style={{ color: colors.primary, fontSize: 14 }}>
                View All
              </ThemedText>
            </Pressable>
          </View>

          {mockNodes.slice(0, 3).map((node, index) => (
            <Pressable
              key={node.nodeHash}
              style={[
                styles.nodeItem,
                index < 2 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/node-detail",
                  params: { nodeHash: node.nodeHash },
                })
              }
            >
              <View style={styles.nodeLeft}>
                <View
                  style={[
                    styles.nodeIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <IconSymbol
                    name="antenna.radiowaves.left.and.right"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <ThemedText type="defaultSemiBold">{node.name}</ThemedText>
                  <ThemedText
                    style={{ color: colors.textSecondary, fontSize: 12 }}
                  >
                    {node.nodeHash}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.nodeRight}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        node.isOnline
                          ? colors.success
                          : colors.textSecondary,
                    },
                  ]}
                />
                <ThemedText style={{ fontSize: 12, marginLeft: 4 }}>
                  {node.batteryLevel || 0}%
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  healthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  healthBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  healthFill: {
    height: "100%",
    borderRadius: 4,
  },
  healthStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  healthStat: {
    alignItems: "center",
  },
  quickActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: {
    flex: 1,
  },
  nodeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  nodeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
