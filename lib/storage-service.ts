/**
 * Storage Service
 * 
 * Handles persistent storage of messages, nodes, and app state using AsyncStorage.
 * Provides a clean interface for CRUD operations on local data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  MESSAGES: '@meshcore/messages',
  NODES: '@meshcore/nodes',
  CONVERSATIONS: '@meshcore/conversations',
  USER_PREFERENCES: '@meshcore/preferences',
  MESSAGE_QUEUE: '@meshcore/message_queue',
} as const;

// Message schema
export interface StoredMessage {
  id: string;
  sender: string; // Node hash
  senderName?: string;
  recipient: string; // Node hash or "broadcast"
  recipientName?: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  channel: number;
  type: 'text' | 'position' | 'telemetry' | 'ack';
  isOutgoing: boolean; // true if sent by current user
}

// Conversation schema
export interface Conversation {
  nodeHash: string;
  nodeName: string;
  lastMessage: StoredMessage;
  unreadCount: number;
  lastUpdated: number;
}

// Node schema
export interface StoredNode {
  nodeHash: string;
  publicKey?: string;
  name: string;
  nodeType: 'chat' | 'repeater' | 'room_server' | 'sensor' | 'companion';
  isOnline: boolean;
  lastSeen: number;
  batteryLevel?: number;
  rssi?: number;
  snr?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  firmwareVersion?: string;
  hardwareModel?: string;
}

// User preferences schema
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  biometricEnabled: boolean;
  userName?: string;
  nodeHash?: string;
}

class StorageService {
  /**
   * ==================
   * MESSAGE OPERATIONS
   * ==================
   */

  /**
   * Save a message to storage
   */
  async saveMessage(message: StoredMessage): Promise<void> {
    try {
      const messages = await this.getAllMessages();
      
      // Check if message already exists (by id)
      const existingIndex = messages.findIndex(m => m.id === message.id);
      
      if (existingIndex >= 0) {
        // Update existing message
        messages[existingIndex] = message;
      } else {
        // Add new message
        messages.push(message);
      }
      
      // Sort by timestamp (newest first)
      messages.sort((a, b) => b.timestamp - a.timestamp);
      
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      
      // Update conversation
      await this.updateConversation(message);
      
      console.log('[Storage] Message saved:', message.id);
    } catch (error) {
      console.error('[Storage] Error saving message:', error);
      throw error;
    }
  }

  /**
   * Get all messages
   */
  async getAllMessages(): Promise<StoredMessage[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Error getting messages:', error);
      return [];
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessagesForNode(nodeHash: string): Promise<StoredMessage[]> {
    try {
      const allMessages = await this.getAllMessages();
      return allMessages.filter(
        m => m.sender === nodeHash || m.recipient === nodeHash
      );
    } catch (error) {
      console.error('[Storage] Error getting messages for node:', error);
      return [];
    }
  }

  /**
   * Update message status
   */
  async updateMessageStatus(messageId: string, status: StoredMessage['status']): Promise<void> {
    try {
      const messages = await this.getAllMessages();
      const messageIndex = messages.findIndex(m => m.id === messageId);
      
      if (messageIndex >= 0) {
        messages[messageIndex].status = status;
        await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        console.log('[Storage] Message status updated:', messageId, status);
      }
    } catch (error) {
      console.error('[Storage] Error updating message status:', error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const messages = await this.getAllMessages();
      const filtered = messages.filter(m => m.id !== messageId);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filtered));
      console.log('[Storage] Message deleted:', messageId);
    } catch (error) {
      console.error('[Storage] Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Clear all messages
   */
  async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.MESSAGES);
      await AsyncStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      console.log('[Storage] All messages cleared');
    } catch (error) {
      console.error('[Storage] Error clearing messages:', error);
      throw error;
    }
  }

  /**
   * ========================
   * CONVERSATION OPERATIONS
   * ========================
   */

  /**
   * Update conversation based on new message
   */
  private async updateConversation(message: StoredMessage): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      
      // Determine the other party in the conversation
      const nodeHash = message.isOutgoing ? message.recipient : message.sender;
      const nodeName = message.isOutgoing ? message.recipientName : message.senderName;
      
      if (nodeHash === 'broadcast') {
        // Skip broadcast messages for conversations
        return;
      }
      
      const existingIndex = conversations.findIndex(c => c.nodeHash === nodeHash);
      
      if (existingIndex >= 0) {
        // Update existing conversation
        conversations[existingIndex].lastMessage = message;
        conversations[existingIndex].lastUpdated = message.timestamp;
        
        // Increment unread count only for incoming messages
        if (!message.isOutgoing && message.status !== 'read') {
          conversations[existingIndex].unreadCount += 1;
        }
      } else {
        // Create new conversation
        conversations.push({
          nodeHash,
          nodeName: nodeName || nodeHash.substring(0, 8),
          lastMessage: message,
          unreadCount: message.isOutgoing ? 0 : 1,
          lastUpdated: message.timestamp,
        });
      }
      
      // Sort by last updated (newest first)
      conversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
      
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('[Storage] Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations
   */
  async getAllConversations(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Error getting conversations:', error);
      return [];
    }
  }

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(nodeHash: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const conversationIndex = conversations.findIndex(c => c.nodeHash === nodeHash);
      
      if (conversationIndex >= 0) {
        conversations[conversationIndex].unreadCount = 0;
        await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
        
        // Also mark messages as read
        const messages = await this.getAllMessages();
        let updated = false;
        
        messages.forEach(m => {
          if (m.sender === nodeHash && m.status !== 'read') {
            m.status = 'read';
            updated = true;
          }
        });
        
        if (updated) {
          await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        }
        
        console.log('[Storage] Conversation marked as read:', nodeHash);
      }
    } catch (error) {
      console.error('[Storage] Error marking conversation as read:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation (and its messages)
   */
  async deleteConversation(nodeHash: string): Promise<void> {
    try {
      // Delete conversation
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(c => c.nodeHash !== nodeHash);
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
      
      // Delete messages
      const messages = await this.getAllMessages();
      const filteredMessages = messages.filter(
        m => m.sender !== nodeHash && m.recipient !== nodeHash
      );
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filteredMessages));
      
      console.log('[Storage] Conversation deleted:', nodeHash);
    } catch (error) {
      console.error('[Storage] Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * =================
   * NODE OPERATIONS
   * =================
   */

  /**
   * Save a node to storage
   */
  async saveNode(node: StoredNode): Promise<void> {
    try {
      const nodes = await this.getAllNodes();
      
      const existingIndex = nodes.findIndex(n => n.nodeHash === node.nodeHash);
      
      if (existingIndex >= 0) {
        // Update existing node (merge with existing data)
        nodes[existingIndex] = {
          ...nodes[existingIndex],
          ...node,
        };
      } else {
        // Add new node
        nodes.push(node);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
      console.log('[Storage] Node saved:', node.nodeHash);
    } catch (error) {
      console.error('[Storage] Error saving node:', error);
      throw error;
    }
  }

  /**
   * Get all nodes
   */
  async getAllNodes(): Promise<StoredNode[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NODES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Error getting nodes:', error);
      return [];
    }
  }

  /**
   * Get a specific node by hash
   */
  async getNode(nodeHash: string): Promise<StoredNode | null> {
    try {
      const nodes = await this.getAllNodes();
      return nodes.find(n => n.nodeHash === nodeHash) || null;
    } catch (error) {
      console.error('[Storage] Error getting node:', error);
      return null;
    }
  }

  /**
   * Update node online status
   */
  async updateNodeStatus(nodeHash: string, isOnline: boolean): Promise<void> {
    try {
      const nodes = await this.getAllNodes();
      const nodeIndex = nodes.findIndex(n => n.nodeHash === nodeHash);
      
      if (nodeIndex >= 0) {
        nodes[nodeIndex].isOnline = isOnline;
        nodes[nodeIndex].lastSeen = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
        console.log('[Storage] Node status updated:', nodeHash, isOnline);
      }
    } catch (error) {
      console.error('[Storage] Error updating node status:', error);
      throw error;
    }
  }

  /**
   * Delete a node
   */
  async deleteNode(nodeHash: string): Promise<void> {
    try {
      const nodes = await this.getAllNodes();
      const filtered = nodes.filter(n => n.nodeHash !== nodeHash);
      await AsyncStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(filtered));
      console.log('[Storage] Node deleted:', nodeHash);
    } catch (error) {
      console.error('[Storage] Error deleting node:', error);
      throw error;
    }
  }

  /**
   * Clear all nodes
   */
  async clearNodes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NODES);
      console.log('[Storage] All nodes cleared');
    } catch (error) {
      console.error('[Storage] Error clearing nodes:', error);
      throw error;
    }
  }

  /**
   * ========================
   * USER PREFERENCES
   * ========================
   */

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {
        theme: 'auto',
        notifications: true,
        soundEnabled: true,
        hapticEnabled: true,
        biometricEnabled: false,
      };
    } catch (error) {
      console.error('[Storage] Error getting preferences:', error);
      return {
        theme: 'auto',
        notifications: true,
        soundEnabled: true,
        hapticEnabled: true,
        biometricEnabled: false,
      };
    }
  }

  /**
   * Save user preferences
   */
  async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      console.log('[Storage] Preferences saved');
    } catch (error) {
      console.error('[Storage] Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * ========================
   * MESSAGE QUEUE
   * ========================
   */

  /**
   * Add message to queue
   */
  async addToQueue(message: StoredMessage): Promise<void> {
    try {
      const queue = await this.getQueue();
      queue.push(message);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGE_QUEUE, JSON.stringify(queue));
      console.log('[Storage] Message added to queue:', message.id);
    } catch (error) {
      console.error('[Storage] Error adding to queue:', error);
      throw error;
    }
  }

  /**
   * Get message queue
   */
  async getQueue(): Promise<StoredMessage[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[Storage] Error getting queue:', error);
      return [];
    }
  }

  /**
   * Remove message from queue
   */
  async removeFromQueue(messageId: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const filtered = queue.filter(m => m.id !== messageId);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGE_QUEUE, JSON.stringify(filtered));
      console.log('[Storage] Message removed from queue:', messageId);
    } catch (error) {
      console.error('[Storage] Error removing from queue:', error);
      throw error;
    }
  }

  /**
   * Clear message queue
   */
  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.MESSAGE_QUEUE);
      console.log('[Storage] Queue cleared');
    } catch (error) {
      console.error('[Storage] Error clearing queue:', error);
      throw error;
    }
  }

  /**
   * ========================
   * UTILITY OPERATIONS
   * ========================
   */

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.MESSAGES,
        STORAGE_KEYS.NODES,
        STORAGE_KEYS.CONVERSATIONS,
        STORAGE_KEYS.MESSAGE_QUEUE,
      ]);
      console.log('[Storage] All storage cleared');
    } catch (error) {
      console.error('[Storage] Error clearing all:', error);
      throw error;
    }
  }

  /**
   * Get storage info (for debugging)
   */
  async getStorageInfo(): Promise<{
    messageCount: number;
    nodeCount: number;
    conversationCount: number;
    queueCount: number;
  }> {
    try {
      const [messages, nodes, conversations, queue] = await Promise.all([
        this.getAllMessages(),
        this.getAllNodes(),
        this.getAllConversations(),
        this.getQueue(),
      ]);

      return {
        messageCount: messages.length,
        nodeCount: nodes.length,
        conversationCount: conversations.length,
        queueCount: queue.length,
      };
    } catch (error) {
      console.error('[Storage] Error getting storage info:', error);
      return {
        messageCount: 0,
        nodeCount: 0,
        conversationCount: 0,
        queueCount: 0,
      };
    }
  }
}

// Singleton instance
export const storageService = new StorageService();
