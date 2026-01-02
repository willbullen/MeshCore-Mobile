import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMessages } from "@/hooks/use-messages";
import { storageService, type StoredMessage } from "@/lib/storage-service";
import { formatRelativeTime } from "@/constants/mock-data";

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const { nodeHash, nodeName } = useLocalSearchParams<{ nodeHash: string; nodeName?: string }>();
  
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [node, setNode] = useState<{ name: string; isOnline: boolean; lastSeen: number } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  // Messages hook
  const [messagesState, messagesActions] = useMessages();
  
  // Get current user's node hash from preferences
  const [myNodeHash, setMyNodeHash] = useState<string>("local-device");

  // Load user preferences and messages on mount
  useEffect(() => {
    loadData();
  }, [nodeHash]);

  // Load messages and node data
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get user preferences
      const prefs = await storageService.getPreferences();
      if (prefs.nodeHash) {
        setMyNodeHash(prefs.nodeHash);
      }
      
      // Get node data
      const nodeData = await storageService.getNode(nodeHash);
      if (nodeData) {
        setNode({
          name: nodeData.name,
          isOnline: nodeData.isOnline,
          lastSeen: nodeData.lastSeen,
        });
      } else {
        // Fallback to URL param or node hash
        setNode({
          name: nodeName || nodeHash.substring(0, 8),
          isOnline: false,
          lastSeen: Date.now(),
        });
      }
      
      // Get messages for this conversation
      const conversationMessages = await messagesActions.getConversationMessages(nodeHash);
      setMessages(conversationMessages);
      
      // Mark as read
      await messagesActions.markAsRead(nodeHash);
      
      setIsLoading(false);
    } catch (error) {
      console.error('[Chat] Error loading data:', error);
      setIsLoading(false);
    }
  };

  // Refresh messages when conversations update
  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [messagesState.conversations.length]);

  // Scroll to bottom when messages load or update
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

  const handleSend = async () => {
    if (messageText.trim() && nodeHash) {
      const text = messageText.trim();
      setMessageText("");
      
      try {
        // Send message via useMessages hook
        await messagesActions.sendMessage(nodeHash, text, 0);
        
        // Reload messages
        await loadData();
        
        console.log("[Chat] Message sent successfully");
      } catch (error) {
        console.error("[Chat] Failed to send message:", error);
        // Message will show as failed in UI
      }
    }
  };

  // Memoize message item render function
  const renderMessage = useCallback(({ item }: { item: StoredMessage }) => {
    const isMine = item.isOutgoing;
    
    // Determine status icon
    let statusIcon = "checkmark.circle";
    let statusColor = "rgba(255,255,255,0.5)";
    
    if (item.status === "sent" || item.status === "delivered") {
      statusIcon = "checkmark.circle.fill";
      statusColor = "rgba(255,255,255,0.9)";
    } else if (item.status === "failed") {
      statusIcon = "exclamationmark.circle.fill";
      statusColor = "#ef4444";
    } else if (item.status === "read") {
      statusIcon = "checkmark.circle.fill";
      statusColor = "#22c55e";
    }
    
    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surface },
          ]}
        >
          {!isMine && item.senderName && (
            <ThemedText style={[styles.senderName, { color: colors.accent }]}>
              {item.senderName}
            </ThemedText>
          )}
          <ThemedText style={[styles.messageText, { color: isMine ? "#ffffff" : colors.text }]}>
            {item.content}
          </ThemedText>
          <View style={styles.messageFooter}>
            <ThemedText
              style={[
                styles.messageTime,
                { color: isMine ? "rgba(255,255,255,0.7)" : colors.textSecondary },
              ]}
            >
              {formatRelativeTime(new Date(item.timestamp))}
            </ThemedText>
            {isMine && (
              <IconSymbol
                name={statusIcon}
                size={14}
                color={statusColor}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, [colors]);
  
  // Memoized key extractor
  const keyExtractor = useCallback((item: StoredMessage) => item.id, []);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={{ marginTop: Spacing.lg, color: colors.textSecondary }}>
          Loading messages...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!node) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="exclamationmark.triangle" size={64} color={colors.textSecondary} />
        <ThemedText style={{ marginTop: Spacing.lg }}>Node not found</ThemedText>
        <Pressable onPress={() => router.back()} style={{ marginTop: Spacing.lg }}>
          <ThemedText style={{ color: colors.primary }}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, 20),
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.headerContent}>
            <ThemedText type="defaultSemiBold">{node.name}</ThemedText>
            <ThemedText style={[styles.headerSubtext, { color: colors.textSecondary }]}>
              {node.isOnline ? "Online" : `Last seen ${formatRelativeTime(new Date(node.lastSeen))}`}
            </ThemedText>
          </View>
          <Pressable style={styles.headerAction} onPress={() => router.push({ pathname: '/node-detail', params: { nodeHash } })}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={[styles.messagesList, { paddingBottom: insets.bottom }]}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={15}
          windowSize={10}
          inverted={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="message.fill" size={64} color={colors.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No messages yet
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: colors.textDisabled }]}>
                Start the conversation by sending a message
              </ThemedText>
            </View>
          }
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, Spacing.md),
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: messageText.trim() ? colors.primary : colors.textDisabled,
              },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  headerSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  headerAction: {
    padding: Spacing.xs,
  },
  messagesList: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  messageContainer: {
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  theirMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  messageTime: {
    fontSize: 11,
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
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
