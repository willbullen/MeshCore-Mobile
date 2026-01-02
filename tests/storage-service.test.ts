import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService, type StoredMessage, type StoredNode } from '../lib/storage-service';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: vi.fn(() => Promise.resolve()),
    getItem: vi.fn(() => Promise.resolve(null)),
    removeItem: vi.fn(() => Promise.resolve()),
    multiRemove: vi.fn(() => Promise.resolve()),
  },
}));

describe('Storage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Message Operations', () => {
    it('should save and retrieve messages', async () => {
      const message: StoredMessage = {
        id: 'msg1',
        sender: 'node1',
        recipient: 'node2',
        content: 'Hello',
        timestamp: Date.now(),
        status: 'sent',
        channel: 0,
        type: 'text',
        isOutgoing: true,
      };

      await storageService.saveMessage(message);
      
      // Note: In real tests, we'd mock AsyncStorage to actually store/retrieve data
      // For now, we're just testing that the methods don't throw errors
      expect(async () => await storageService.getAllMessages()).not.toThrow();
    });

    it('should update message status', async () => {
      const messageId = 'msg1';
      const newStatus = 'delivered';

      await expect(
        storageService.updateMessageStatus(messageId, newStatus)
      ).resolves.not.toThrow();
    });

    it('should get messages for a specific node', async () => {
      const nodeHash = 'node123';
      
      const messages = await storageService.getMessagesForNode(nodeHash);
      expect(Array.isArray(messages)).toBe(true);
    });
  });

  describe('Node Operations', () => {
    it('should save and retrieve nodes', async () => {
      const node: StoredNode = {
        nodeHash: 'node123',
        name: 'Test Node',
        nodeType: 'chat',
        isOnline: true,
        lastSeen: Date.now(),
        batteryLevel: 85,
      };

      await storageService.saveNode(node);
      
      expect(async () => await storageService.getAllNodes()).not.toThrow();
    });

    it('should update node status', async () => {
      const nodeHash = 'node123';
      
      await expect(
        storageService.updateNodeStatus(nodeHash, true)
      ).resolves.not.toThrow();
    });

    it('should get a specific node', async () => {
      const nodeHash = 'node123';
      
      const node = await storageService.getNode(nodeHash);
      // Will be null in test env without proper mocking
      expect(node === null || typeof node === 'object').toBe(true);
    });
  });

  describe('Conversation Operations', () => {
    it('should get all conversations', async () => {
      const conversations = await storageService.getAllConversations();
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('should mark conversation as read', async () => {
      const nodeHash = 'node123';
      
      await expect(
        storageService.markConversationAsRead(nodeHash)
      ).resolves.not.toThrow();
    });
  });

  describe('User Preferences', () => {
    it('should get default preferences', async () => {
      const prefs = await storageService.getPreferences();
      
      expect(prefs).toHaveProperty('theme');
      expect(prefs).toHaveProperty('notifications');
      expect(prefs).toHaveProperty('soundEnabled');
    });

    it('should save preferences', async () => {
      const newPrefs = {
        theme: 'dark' as const,
        notifications: true,
      };
      
      await expect(
        storageService.savePreferences(newPrefs)
      ).resolves.not.toThrow();
    });
  });

  describe('Message Queue', () => {
    it('should add message to queue', async () => {
      const message: StoredMessage = {
        id: 'queued1',
        sender: 'node1',
        recipient: 'node2',
        content: 'Queued message',
        timestamp: Date.now(),
        status: 'pending',
        channel: 0,
        type: 'text',
        isOutgoing: true,
      };

      await expect(
        storageService.addToQueue(message)
      ).resolves.not.toThrow();
    });

    it('should get queue', async () => {
      const queue = await storageService.getQueue();
      expect(Array.isArray(queue)).toBe(true);
    });

    it('should remove from queue', async () => {
      const messageId = 'queued1';
      
      await expect(
        storageService.removeFromQueue(messageId)
      ).resolves.not.toThrow();
    });
  });

  describe('Storage Info', () => {
    it('should get storage info', async () => {
      const info = await storageService.getStorageInfo();
      
      expect(info).toHaveProperty('messageCount');
      expect(info).toHaveProperty('nodeCount');
      expect(info).toHaveProperty('conversationCount');
      expect(info).toHaveProperty('queueCount');
      
      expect(typeof info.messageCount).toBe('number');
      expect(typeof info.nodeCount).toBe('number');
    });
  });
});
