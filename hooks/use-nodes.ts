import { useState, useEffect, useCallback, useMemo } from 'react';
import { storageService, type StoredNode } from '@/lib/storage-service';
import { nodeService } from '@/lib/node-service';
import { useBluetooth } from './use-bluetooth';
import type { MeshPacket } from '@/lib/meshcore-protocol';

export interface NodesState {
  nodes: StoredNode[];
  isLoading: boolean;
  error: string | null;
  onlineCount: number;
  averageBattery: number;
}

export interface NodesActions {
  refreshNodes: () => Promise<void>;
  getNode: (nodeHash: string) => Promise<StoredNode | null>;
  deleteNode: (nodeHash: string) => Promise<void>;
  clearAllNodes: () => Promise<void>;
}

export function useNodes(): [NodesState, NodesActions] {
  const [bluetoothState, bluetoothActions] = useBluetooth();
  
  const [state, setState] = useState<NodesState>({
    nodes: [],
    isLoading: true,
    error: null,
    onlineCount: 0,
    averageBattery: 0,
  });

  // Load nodes on mount
  useEffect(() => {
    loadNodes();
    
    // Set up periodic status update (every 30 seconds)
    const statusInterval = setInterval(() => {
      nodeService.updateOnlineStatus().then(() => {
        loadNodes();
      });
    }, 30 * 1000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Listen for incoming packets via BLE
  useEffect(() => {
    const unsubscribe = bluetoothActions.onMessageReceived((packet: MeshPacket) => {
      handleIncomingPacket(packet);
    });

    return () => {
      unsubscribe();
    };
  }, [bluetoothActions]);

  /**
   * Load all nodes from storage
   */
  const loadNodes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Update online status first
      await nodeService.updateOnlineStatus();
      
      // Get all nodes
      const nodes = await nodeService.getNodes('lastSeen');
      
      // Calculate metrics
      const onlineCount = nodes.filter(n => n.isOnline).length;
      const averageBattery = await nodeService.getAverageBatteryLevel();
      
      setState({
        nodes,
        isLoading: false,
        error: null,
        onlineCount,
        averageBattery,
      });
      
      console.log('[useNodes] Loaded nodes:', nodes.length);
    } catch (error: any) {
      console.error('[useNodes] Error loading nodes:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to load nodes',
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Handle incoming packet from BLE
   */
  const handleIncomingPacket = useCallback(async (packet: MeshPacket) => {
    try {
      console.log('[useNodes] Processing packet for node:', packet.from);
      
      // Process packet and update node data
      await nodeService.processPacket(packet);
      
      // Refresh nodes list
      await loadNodes();
    } catch (error) {
      console.error('[useNodes] Error handling incoming packet:', error);
    }
  }, [loadNodes]);

  /**
   * Refresh nodes
   */
  const refreshNodes = useCallback(async () => {
    await loadNodes();
  }, [loadNodes]);

  /**
   * Get a specific node
   */
  const getNode = useCallback(
    async (nodeHash: string): Promise<StoredNode | null> => {
      try {
        return await storageService.getNode(nodeHash);
      } catch (error) {
        console.error('[useNodes] Error getting node:', error);
        return null;
      }
    },
    []
  );

  /**
   * Delete a node
   */
  const deleteNode = useCallback(
    async (nodeHash: string) => {
      try {
        await storageService.deleteNode(nodeHash);
        await loadNodes();
        console.log('[useNodes] Node deleted:', nodeHash);
      } catch (error) {
        console.error('[useNodes] Error deleting node:', error);
        throw error;
      }
    },
    [loadNodes]
  );

  /**
   * Clear all nodes
   */
  const clearAllNodes = useCallback(async () => {
    try {
      await storageService.clearNodes();
      await loadNodes();
      console.log('[useNodes] All nodes cleared');
    } catch (error) {
      console.error('[useNodes] Error clearing nodes:', error);
      throw error;
    }
  }, [loadNodes]);

  // Memoize actions object to prevent infinite re-renders
  const actions: NodesActions = useMemo(() => ({
    refreshNodes,
    getNode,
    deleteNode,
    clearAllNodes,
  }), [refreshNodes, getNode, deleteNode, clearAllNodes]);

  return [state, actions];
}
