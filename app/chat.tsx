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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  mockNodes,
  getMessagesForNode,
  formatRelativeTime,
  type Message,
} from "@/constants/mock-data";

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  const { nodeHash } = useLocalSearchParams<{ nodeHash: string }>();
  
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  
  // Find the node and messages
  const node = mockNodes.find((n) => n.nodeHash === nodeHash);
  const messages = node ? getMessagesForNode(nodeHash) : [];
  
  // My node (Base Station)
  const myNodeHash = "a1b2c3d4";

  useEffect(() => {
    // Scroll to bottom when messages load
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (messageText.trim()) {
      // TODO: Add message to list
      setMessageText("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender.nodeHash === myNodeHash;
    
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
          {!isMine && (
            <ThemedText style={[styles.senderName, { color: colors.accent }]}>
              {item.sender.name}
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
              {formatRelativeTime(item.timestamp)}
            </ThemedText>
            {isMine && (
              <IconSymbol
                name={item.status === "delivered" ? "checkmark.circle.fill" : "checkmark.circle.fill"}
                size={14}
                color={item.status === "delivered" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)"}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!node) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Node not found</ThemedText>
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
              {node.isOnline ? "Online" : `Last seen ${formatRelativeTime(node.lastSeen)}`}
            </ThemedText>
          </View>
          <Pressable style={styles.headerAction}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messagesList, { paddingBottom: insets.bottom }]}
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
