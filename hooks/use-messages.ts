import { useState, useEffect, useCallback, useRef } from 'react';
import { storageService, type StoredMessage, type Conversation } from '@/lib/storage-service';
import { useBluetooth } from './use-bluetooth';
import { PacketType, type MeshPacket } from '@/lib/meshcore-protocol';

export interface MessagesState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

export interface MessagesActions {
  sendMessage: (to: string, text: string, channel?: number) => Promise<void>;
  refreshConversations: () => Promise<void>;
  getConversationMessages: (nodeHash: string) => Promise<StoredMessage[]>;
  markAsRead: (nodeHash: string) => Promise<void>;
  deleteConversation: (nodeHash: string) => Promise<void>;
  clearAllMessages: () => Promise<void>;
}

export function useMessages(): [MessagesState, MessagesActions] {
  const [bluetoothState, bluetoothActions] = useBluetooth();
  
  // Store bluetoothActions in ref to avoid re-subscribing on every render
  const bluetoothActionsRef = useRef(bluetoothActions);
  bluetoothActionsRef.current = bluetoothActions;
  
  const [state, setState] = useState<MessagesState>({
    conversations: [],
    isLoading: true,
    error: null,
  });

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Listen for incoming messages via BLE
  useEffect(() => {
    const unsubscribe = bluetoothActionsRef.current.onMessageReceived((packet: MeshPacket) => {
      handleIncomingPacket(packet);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array - only subscribe once

  /**
   * Load all conversations from storage
   */
  const loadConversations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const conversations = await storageService.getAllConversations();
      
      setState(prev => ({
        ...prev,
        conversations,
        isLoading: false,
      }));
      
      console.log('[useMessages] Loaded conversations:', conversations.length);
    } catch (error: any) {
      console.error('[useMessages] Error loading conversations:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to load conversations',
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Handle incoming message packet from BLE
   */
  const handleIncomingPacket = useCallback(async (packet: MeshPacket) => {
    try {
      console.log('[useMessages] Received packet:', packet);
      
      // Only process text messages for now
      if (packet.type === PacketType.TEXT_MESSAGE) {
        const textPayload = packet.payload as { text: string; channel: number };
        
        const message: StoredMessage = {
          id: `${packet.from}-${packet.id}`,
          sender: packet.from,
          senderName: undefined, // TODO: Get from node cache
          recipient: packet.to,
          recipientName: undefined,
          content: textPayload.text,
          timestamp: packet.timestamp,
          status: 'delivered',
          channel: textPayload.channel || 0,
          type: 'text',
          isOutgoing: false,
        };
        
        // Save to storage
        await storageService.saveMessage(message);
        
        // Refresh conversations
        await loadConversations();
        
        console.log('[useMessages] Incoming message saved:', message.id);
      }
    } catch (error) {
      console.error('[useMessages] Error handling incoming packet:', error);
    }
  }, [loadConversations]);

  /**
   * Send a text message
   */
  const sendMessage = useCallback(
    async (to: string, text: string, channel: number = 0) => {
      try {
        if (!bluetoothState.isConnected || !bluetoothState.connectedDevice) {
          throw new Error('Not connected to a device');
        }

        const from = bluetoothState.connectedDevice.id;
        
        // Generate message ID
        const messageId = `${from}-${Date.now()}`;
        
        // Create message object
        const message: StoredMessage = {
          id: messageId,
          sender: from,
          senderName: undefined,
          recipient: to,
          recipientName: undefined,
          content: text,
          timestamp: Date.now(),
          status: 'pending',
          channel,
          type: 'text',
          isOutgoing: true,
        };
        
        // Save to storage immediately
        await storageService.saveMessage(message);
        
        // Refresh UI
        await loadConversations();
        
        try {
          // Send via BLE using ref to avoid dependency
          await bluetoothActionsRef.current.sendMessage(to, text, channel);
          
          // Update status to sent
          await storageService.updateMessageStatus(messageId, 'sent');
          console.log('[useMessages] Message sent:', messageId);
        } catch (sendError) {
          // Update status to failed
          await storageService.updateMessageStatus(messageId, 'failed');
          throw sendError;
        }
        
        // Refresh conversations again to show updated status
        await loadConversations();
      } catch (error: any) {
        console.error('[useMessages] Error sending message:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to send message',
        }));
        throw error;
      }
    },
    [bluetoothState, loadConversations]
  );

  /**
   * Refresh conversations
   */
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  /**
   * Get messages for a specific conversation
   */
  const getConversationMessages = useCallback(
    async (nodeHash: string): Promise<StoredMessage[]> => {
      try {
        const messages = await storageService.getMessagesForNode(nodeHash);
        return messages;
      } catch (error) {
        console.error('[useMessages] Error getting conversation messages:', error);
        return [];
      }
    },
    []
  );

  /**
   * Mark conversation as read
   */
  const markAsRead = useCallback(
    async (nodeHash: string) => {
      try {
        await storageService.markConversationAsRead(nodeHash);
        await loadConversations();
        console.log('[useMessages] Conversation marked as read:', nodeHash);
      } catch (error) {
        console.error('[useMessages] Error marking as read:', error);
        throw error;
      }
    },
    [loadConversations]
  );

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(
    async (nodeHash: string) => {
      try {
        await storageService.deleteConversation(nodeHash);
        await loadConversations();
        console.log('[useMessages] Conversation deleted:', nodeHash);
      } catch (error) {
        console.error('[useMessages] Error deleting conversation:', error);
        throw error;
      }
    },
    [loadConversations]
  );

  /**
   * Clear all messages
   */
  const clearAllMessages = useCallback(async () => {
    try {
      await storageService.clearMessages();
      await loadConversations();
      console.log('[useMessages] All messages cleared');
    } catch (error) {
      console.error('[useMessages] Error clearing messages:', error);
      throw error;
    }
  }, [loadConversations]);

  const actions: MessagesActions = {
    sendMessage,
    refreshConversations,
    getConversationMessages,
    markAsRead,
    deleteConversation,
    clearAllMessages,
  };

  return [state, actions];
}
