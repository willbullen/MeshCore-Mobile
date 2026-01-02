import { useState, useEffect, useCallback } from 'react';
import { messageQueue } from '@/lib/message-queue';
import { useBluetooth } from './use-bluetooth';

export interface MessageQueueState {
  totalCount: number;
  pendingCount: number;
  retryingCount: number;
  isProcessing: boolean;
}

export interface MessageQueueActions {
  refreshStatus: () => Promise<void>;
  retryAll: () => Promise<void>;
  clearFailed: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useMessageQueue(): [MessageQueueState, MessageQueueActions] {
  const [bluetoothState] = useBluetooth();
  
  const [state, setState] = useState<MessageQueueState>({
    totalCount: 0,
    pendingCount: 0,
    retryingCount: 0,
    isProcessing: false,
  });

  // Load queue status on mount
  useEffect(() => {
    loadStatus();
    
    // Start queue processor
    messageQueue.start();
    
    // Set up periodic refresh
    const interval = setInterval(loadStatus, 5000);
    
    return () => {
      clearInterval(interval);
      messageQueue.stop();
    };
  }, []);

  // Reload status when connection state changes
  useEffect(() => {
    if (bluetoothState.isConnected) {
      loadStatus();
    }
  }, [bluetoothState.isConnected]);

  /**
   * Load queue status
   */
  const loadStatus = useCallback(async () => {
    try {
      const status = await messageQueue.getQueueStatus();
      setState(prev => ({
        ...prev,
        ...status,
      }));
    } catch (error) {
      console.error('[useMessageQueue] Error loading status:', error);
    }
  }, []);

  /**
   * Refresh status
   */
  const refreshStatus = useCallback(async () => {
    await loadStatus();
  }, [loadStatus]);

  /**
   * Retry all messages
   */
  const retryAll = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      await messageQueue.retryAll();
      await loadStatus();
    } catch (error) {
      console.error('[useMessageQueue] Error retrying all:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [loadStatus]);

  /**
   * Clear failed messages
   */
  const clearFailed = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      await messageQueue.clearFailed();
      await loadStatus();
    } catch (error) {
      console.error('[useMessageQueue] Error clearing failed:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [loadStatus]);

  /**
   * Clear all messages
   */
  const clearAll = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      await messageQueue.clearAll();
      await loadStatus();
    } catch (error) {
      console.error('[useMessageQueue] Error clearing all:', error);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [loadStatus]);

  const actions: MessageQueueActions = {
    refreshStatus,
    retryAll,
    clearFailed,
    clearAll,
  };

  return [state, actions];
}
