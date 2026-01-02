import { useRouter } from "expo-router";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useNodes } from "@/hooks/use-nodes";
import { useMessages } from "@/hooks/use-messages";
import { storageService } from "@/lib/storage-service";
import type { StoredMessage } from "@/lib/storage-service";
import { formatRelativeTime } from "@/constants/mock-data";

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [bluetoothState] = useBluetooth();
  const [refreshing, setRefreshing] = useState(false);
  
  // Get data from hooks
  const [nodesState, nodesActions] = useNodes();
  const [messagesState, messagesActions] = useMessages();
  
  // Get recent messages
  const [recentMessages, setRecentMessages] = useState<StoredMessage[]>([]);
  
  useEffect(() => {
    loadRecentMessages();
  }, [messagesState.conversations]);
  
  const loadRecentMessages = async () => {
    const allMessages = await storageService.getAllMessages();
    const recent = allMessages.slice(0, 5);
    setRecentMessages(recent);
  };

  // Calculate metrics
  const onlineNodes = nodesState.onlineCount;
  const totalNodes = nodesState.nodes.length;
  const avgBattery = nodesState.averageBattery;
  const networkHealth = totalNodes > 0 ? onlineNodes / totalNodes : 0;
  const messagesToday = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return recentMessages.filter(m => m.timestamp >= today).length;
  }, [recentMessages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      nodesActions.refreshNodes(),
      messagesActions.refreshConversations(),
    ]);
    await loadRecentMessages();
    setRefreshing(false);
  }, [nodesActions, messagesActions]);

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
                {messagesToday}
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

          {recentMessages.length > 0 ? (
            recentMessages.map((message, index) => (
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
                    params: { 
                      nodeHash: message.isOutgoing ? message.recipient : message.sender,
                      nodeName: message.isOutgoing ? message.recipientName : message.senderName
                    },
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
                      {(message.isOutgoing ? (message.recipientName || message.recipient) : (message.senderName || message.sender)).charAt(0).toUpperCase()}
                    </ThemedText>
                  </View>
                  <View style={styles.activityInfo}>
                    <ThemedText type="defaultSemiBold">
                      {message.isOutgoing ? (message.recipientName || message.recipient.substring(0, 8)) : (message.senderName || message.sender.substring(0, 8))}
                    </ThemedText>
                    <ThemedText
                      style={{ color: colors.textSecondary, fontSize: 13 }}
                      numberOfLines={1}
                    >
                      {message.isOutgoing && "You: "}{message.content}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {formatRelativeTime(new Date(message.timestamp))}
                </ThemedText>
              </Pressable>
            ))
          ) : (
            <ThemedText style={{ color: colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.md }}>
              No recent activity
            </ThemedText>
          )}
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

          {nodesState.nodes.length > 0 ? (
            nodesState.nodes.slice(0, 3).map((node, index) => (
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
                      {node.nodeHash.substring(0, 12)}...
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
            ))
          ) : (
            <ThemedText style={{ color: colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.md }}>
              No nodes discovered
            </ThemedText>
          )}
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
