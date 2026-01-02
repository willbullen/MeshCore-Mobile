/**
 * Node Service
 * 
 * Manages node data processing, including parsing BLE packets,
 * updating node status, and calculating derived metrics.
 */

import { storageService, type StoredNode } from './storage-service';
import type { MeshPacket, TelemetryPayload, PositionPayload, NodeInfoPayload } from './meshcore-protocol';
import { PacketType } from './meshcore-protocol';

// Online threshold: nodes are considered offline if not seen for 5 minutes
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

class NodeService {
  /**
   * Process incoming packet and update node data
   */
  async processPacket(packet: MeshPacket): Promise<void> {
    try {
      const nodeHash = packet.from;
      
      // Get existing node or create new one
      let node = await storageService.getNode(nodeHash);
      
      if (!node) {
        // Create new node
        node = {
          nodeHash,
          name: nodeHash.substring(0, 8), // Default name
          nodeType: 'chat', // Default type
          isOnline: true,
          lastSeen: packet.timestamp,
        };
      } else {
        // Update last seen
        node.lastSeen = packet.timestamp;
        node.isOnline = true;
      }
      
      // Process packet based on type
      switch (packet.type) {
        case PacketType.NODE_INFO:
          await this.processNodeInfo(node, packet.payload as NodeInfoPayload);
          break;
          
        case PacketType.TELEMETRY:
          await this.processTelemetry(node, packet.payload as TelemetryPayload);
          break;
          
        case PacketType.POSITION:
          await this.processPosition(node, packet.payload as PositionPayload);
          break;
          
        default:
          // Just update last seen for other packet types
          break;
      }
      
      // Save updated node
      await storageService.saveNode(node);
      
      console.log('[NodeService] Node updated:', nodeHash);
    } catch (error) {
      console.error('[NodeService] Error processing packet:', error);
      throw error;
    }
  }
  
  /**
   * Process NODE_INFO packet
   */
  private async processNodeInfo(node: StoredNode, payload: NodeInfoPayload): Promise<void> {
    node.name = payload.name || node.name;
    node.hardwareModel = payload.hardwareModel;
    node.firmwareVersion = payload.firmwareVersion;
    node.publicKey = payload.nodeHash; // Assuming node hash is derived from public key
  }
  
  /**
   * Process TELEMETRY packet
   */
  private async processTelemetry(node: StoredNode, payload: TelemetryPayload): Promise<void> {
    if (payload.batteryLevel !== undefined) {
      node.batteryLevel = payload.batteryLevel;
    }
    
    // RSSI and SNR would come from BLE layer, not payload
    // These are typically set elsewhere
  }
  
  /**
   * Process POSITION packet
   */
  private async processPosition(node: StoredNode, payload: PositionPayload): Promise<void> {
    node.latitude = payload.latitude;
    node.longitude = payload.longitude;
    node.altitude = payload.altitude;
  }
  
  /**
   * Update node RSSI/SNR from BLE connection
   */
  async updateSignalStrength(nodeHash: string, rssi: number, snr?: number): Promise<void> {
    try {
      const node = await storageService.getNode(nodeHash);
      
      if (node) {
        node.rssi = rssi;
        if (snr !== undefined) {
          node.snr = snr;
        }
        node.lastSeen = Date.now();
        node.isOnline = true;
        
        await storageService.saveNode(node);
        console.log('[NodeService] Signal strength updated:', nodeHash, rssi, snr);
      }
    } catch (error) {
      console.error('[NodeService] Error updating signal strength:', error);
      throw error;
    }
  }
  
  /**
   * Update all nodes' online status based on last seen timestamp
   */
  async updateOnlineStatus(): Promise<void> {
    try {
      const nodes = await storageService.getAllNodes();
      const now = Date.now();
      let updated = false;
      
      for (const node of nodes) {
        const wasOnline = node.isOnline;
        const isNowOnline = (now - node.lastSeen) < ONLINE_THRESHOLD_MS;
        
        if (wasOnline !== isNowOnline) {
          node.isOnline = isNowOnline;
          await storageService.saveNode(node);
          updated = true;
        }
      }
      
      if (updated) {
        console.log('[NodeService] Online status updated for nodes');
      }
    } catch (error) {
      console.error('[NodeService] Error updating online status:', error);
      throw error;
    }
  }
  
  /**
   * Get all nodes sorted by last seen (most recent first)
   */
  async getNodes(sortBy: 'lastSeen' | 'name' | 'battery' = 'lastSeen'): Promise<StoredNode[]> {
    try {
      const nodes = await storageService.getAllNodes();
      
      // Sort nodes
      switch (sortBy) {
        case 'lastSeen':
          nodes.sort((a, b) => b.lastSeen - a.lastSeen);
          break;
          
        case 'name':
          nodes.sort((a, b) => a.name.localeCompare(b.name));
          break;
          
        case 'battery':
          nodes.sort((a, b) => {
            const aLevel = a.batteryLevel ?? -1;
            const bLevel = b.batteryLevel ?? -1;
            return bLevel - aLevel;
          });
          break;
      }
      
      return nodes;
    } catch (error) {
      console.error('[NodeService] Error getting nodes:', error);
      return [];
    }
  }
  
  /**
   * Get online nodes only
   */
  async getOnlineNodes(): Promise<StoredNode[]> {
    try {
      const nodes = await this.getNodes('lastSeen');
      return nodes.filter(node => node.isOnline);
    } catch (error) {
      console.error('[NodeService] Error getting online nodes:', error);
      return [];
    }
  }
  
  /**
   * Get nodes with low battery (< 20%)
   */
  async getLowBatteryNodes(): Promise<StoredNode[]> {
    try {
      const nodes = await storageService.getAllNodes();
      return nodes.filter(node => 
        node.batteryLevel !== undefined && node.batteryLevel < 20
      );
    } catch (error) {
      console.error('[NodeService] Error getting low battery nodes:', error);
      return [];
    }
  }
  
  /**
   * Get nodes with GPS coordinates
   */
  async getNodesWithLocation(): Promise<StoredNode[]> {
    try {
      const nodes = await storageService.getAllNodes();
      return nodes.filter(node => 
        node.latitude !== undefined && node.longitude !== undefined
      );
    } catch (error) {
      console.error('[NodeService] Error getting nodes with location:', error);
      return [];
    }
  }
  
  /**
   * Calculate average battery level across all nodes
   */
  async getAverageBatteryLevel(): Promise<number> {
    try {
      const nodes = await storageService.getAllNodes();
      const nodesWithBattery = nodes.filter(n => n.batteryLevel !== undefined);
      
      if (nodesWithBattery.length === 0) {
        return 0;
      }
      
      const sum = nodesWithBattery.reduce((acc, n) => acc + (n.batteryLevel ?? 0), 0);
      return Math.round(sum / nodesWithBattery.length);
    } catch (error) {
      console.error('[NodeService] Error calculating average battery:', error);
      return 0;
    }
  }
  
  /**
   * Get signal strength quality descriptor
   */
  getSignalQuality(rssi: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (rssi >= -50) return 'excellent';
    if (rssi >= -70) return 'good';
    if (rssi >= -85) return 'fair';
    return 'poor';
  }
  
  /**
   * Get battery level color
   */
  getBatteryColor(level: number): string {
    if (level >= 60) return '#22c55e'; // Green
    if (level >= 30) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }
}

// Singleton instance
export const nodeService = new NodeService();
