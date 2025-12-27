import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockConversations,
  formatRelativeTime,
  getStatusColor,
  type Conversation,
} from "@/constants/mock-data";

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const [selectedChannel, setSelectedChannel] = useState("LongFast");

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: "/chat" as any,
      params: { nodeHash: conversation.node.nodeHash },
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const statusColor = getStatusColor(item.node.isOnline);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.conversationCard,
          { backgroundColor: colors.surface },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => handleConversationPress(item)}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.avatarText}>
            {item.node.name.charAt(0).toUpperCase()}
          </ThemedText>
          {/* Online status indicator */}
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor, borderColor: colors.surface },
            ]}
          />
        </View>

        {/* Content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <ThemedText type="defaultSemiBold" style={styles.nodeName}>
              {item.node.name}
            </ThemedText>
            <ThemedText style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatRelativeTime(item.lastMessage.timestamp)}
            </ThemedText>
          </View>
          
          <View style={styles.conversationFooter}>
            <ThemedText
              numberOfLines={1}
              style={[styles.messagePreview, { color: colors.textSecondary }]}
            >
              {item.lastMessage.content}
            </ThemedText>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
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
        <ThemedText type="title">Messages</ThemedText>
        <Pressable
          style={[styles.channelSelector, { backgroundColor: colors.surface }]}
          onPress={() => {
            // TODO: Open channel selector modal
          }}
        >
          <ThemedText style={[styles.channelText, { color: colors.primary }]}>
            {selectedChannel}
          </ThemedText>
          <IconSymbol name="chevron.down" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {/* Conversations List */}
      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.node.nodeHash}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="message.fill" size={64} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No conversations yet
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.textDisabled }]}>
              Messages will appear here when you start chatting
            </ThemedText>
          </View>
        }
      />

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + 16,
          },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={() => {
          // TODO: Open new message screen
        }}
      >
        <IconSymbol name="plus" size={24} color="#ffffff" />
      </Pressable>
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
  },
  channelSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  channelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: Spacing.lg,
  },
  conversationCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.xs,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nodeName: {
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
  },
  conversationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
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
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
