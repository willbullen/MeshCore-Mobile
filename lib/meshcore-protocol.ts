/**
 * MeshCore Protocol Handler
 * 
 * Handles encoding and decoding of MeshCore packets for transmission over BLE.
 * Based on the Meshtastic protocol with custom extensions for MeshCore.
 */

// Packet types
export enum PacketType {
  TEXT_MESSAGE = 0x01,
  POSITION = 0x02,
  TELEMETRY = 0x03,
  NODE_INFO = 0x04,
  ACK = 0x05,
  PING = 0x06,
  PONG = 0x07,
}

// Packet structure
export interface MeshPacket {
  type: PacketType;
  from: string; // Node hash
  to: string; // Node hash (or "broadcast" for all)
  id: number; // Packet ID for acknowledgment
  payload: any;
  timestamp: number;
}

export interface TextMessagePayload {
  text: string;
  channel: number;
}

export interface PositionPayload {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface TelemetryPayload {
  batteryLevel?: number;
  voltage?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
}

export interface NodeInfoPayload {
  nodeHash: string;
  name: string;
  hardwareModel: string;
  firmwareVersion: string;
}

export interface AckPayload {
  packetId: number;
  success: boolean;
}

class MeshCoreProtocol {
  private packetIdCounter: number = 0;

  /**
   * Generate a unique packet ID
   */
  private generatePacketId(): number {
    this.packetIdCounter = (this.packetIdCounter + 1) % 65536;
    return this.packetIdCounter;
  }

  /**
   * Calculate CRC16 checksum for data integrity
   */
  private calculateCRC16(data: Buffer): number {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 0x0001) {
          crc = (crc >> 1) ^ 0xa001;
        } else {
          crc = crc >> 1;
        }
      }
    }
    return crc;
  }

  /**
   * Encode a text message packet
   */
  encodeTextMessage(
    from: string,
    to: string,
    text: string,
    channel: number = 0
  ): string {
    const packet: MeshPacket = {
      type: PacketType.TEXT_MESSAGE,
      from,
      to,
      id: this.generatePacketId(),
      payload: {
        text,
        channel,
      } as TextMessagePayload,
      timestamp: Date.now(),
    };

    return this.encodePacket(packet);
  }

  /**
   * Encode a position packet
   */
  encodePosition(
    from: string,
    to: string,
    latitude: number,
    longitude: number,
    altitude?: number,
    accuracy?: number
  ): string {
    const packet: MeshPacket = {
      type: PacketType.POSITION,
      from,
      to,
      id: this.generatePacketId(),
      payload: {
        latitude,
        longitude,
        altitude,
        accuracy,
      } as PositionPayload,
      timestamp: Date.now(),
    };

    return this.encodePacket(packet);
  }

  /**
   * Encode a telemetry packet
   */
  encodeTelemetry(
    from: string,
    to: string,
    telemetry: TelemetryPayload
  ): string {
    const packet: MeshPacket = {
      type: PacketType.TELEMETRY,
      from,
      to,
      id: this.generatePacketId(),
      payload: telemetry,
      timestamp: Date.now(),
    };

    return this.encodePacket(packet);
  }

  /**
   * Encode an acknowledgment packet
   */
  encodeAck(from: string, to: string, packetId: number, success: boolean): string {
    const packet: MeshPacket = {
      type: PacketType.ACK,
      from,
      to,
      id: this.generatePacketId(),
      payload: {
        packetId,
        success,
      } as AckPayload,
      timestamp: Date.now(),
    };

    return this.encodePacket(packet);
  }

  /**
   * Encode a ping packet
   */
  encodePing(from: string, to: string): string {
    const packet: MeshPacket = {
      type: PacketType.PING,
      from,
      to,
      id: this.generatePacketId(),
      payload: {},
      timestamp: Date.now(),
    };

    return this.encodePacket(packet);
  }

  /**
   * Generic packet encoder
   */
  private encodePacket(packet: MeshPacket): string {
    try {
      // Convert packet to JSON
      const json = JSON.stringify(packet);
      
      // Create buffer with header and payload
      const payloadBuffer = Buffer.from(json, "utf-8");
      const headerBuffer = Buffer.alloc(4);
      
      // Write magic byte (0xAA)
      headerBuffer.writeUInt8(0xaa, 0);
      
      // Write packet type
      headerBuffer.writeUInt8(packet.type, 1);
      
      // Write payload length (2 bytes)
      headerBuffer.writeUInt16LE(payloadBuffer.length, 2);
      
      // Combine header and payload
      const dataBuffer = Buffer.concat([headerBuffer, payloadBuffer]);
      
      // Calculate and append CRC
      const crc = this.calculateCRC16(dataBuffer);
      const crcBuffer = Buffer.alloc(2);
      crcBuffer.writeUInt16LE(crc, 0);
      
      const finalBuffer = Buffer.concat([dataBuffer, crcBuffer]);
      
      // Return as base64 string for BLE transmission
      return finalBuffer.toString("base64");
    } catch (error) {
      console.error("[Protocol] Encode error:", error);
      throw new Error("Failed to encode packet");
    }
  }

  /**
   * Decode a received packet
   */
  decodePacket(data: string): MeshPacket | null {
    try {
      // Decode from base64
      const buffer = Buffer.from(data, "base64");
      
      if (buffer.length < 6) {
        console.error("[Protocol] Packet too short");
        return null;
      }
      
      // Verify magic byte
      const magic = buffer.readUInt8(0);
      if (magic !== 0xaa) {
        console.error("[Protocol] Invalid magic byte:", magic);
        return null;
      }
      
      // Read packet type
      const type = buffer.readUInt8(1);
      
      // Read payload length
      const payloadLength = buffer.readUInt16LE(2);
      
      if (buffer.length < 4 + payloadLength + 2) {
        console.error("[Protocol] Invalid packet length");
        return null;
      }
      
      // Extract payload
      const payloadBuffer = buffer.slice(4, 4 + payloadLength);
      
      // Verify CRC
      const receivedCRC = buffer.readUInt16LE(4 + payloadLength);
      const dataBuffer = buffer.slice(0, 4 + payloadLength);
      const calculatedCRC = this.calculateCRC16(dataBuffer);
      
      if (receivedCRC !== calculatedCRC) {
        console.error("[Protocol] CRC mismatch");
        return null;
      }
      
      // Parse JSON payload
      const json = payloadBuffer.toString("utf-8");
      const packet: MeshPacket = JSON.parse(json);
      
      return packet;
    } catch (error) {
      console.error("[Protocol] Decode error:", error);
      return null;
    }
  }

  /**
   * Decode a text message packet
   */
  decodeTextMessage(packet: MeshPacket): TextMessagePayload | null {
    if (packet.type !== PacketType.TEXT_MESSAGE) {
      return null;
    }
    return packet.payload as TextMessagePayload;
  }

  /**
   * Decode a position packet
   */
  decodePosition(packet: MeshPacket): PositionPayload | null {
    if (packet.type !== PacketType.POSITION) {
      return null;
    }
    return packet.payload as PositionPayload;
  }

  /**
   * Decode a telemetry packet
   */
  decodeTelemetry(packet: MeshPacket): TelemetryPayload | null {
    if (packet.type !== PacketType.TELEMETRY) {
      return null;
    }
    return packet.payload as TelemetryPayload;
  }

  /**
   * Decode an acknowledgment packet
   */
  decodeAck(packet: MeshPacket): AckPayload | null {
    if (packet.type !== PacketType.ACK) {
      return null;
    }
    return packet.payload as AckPayload;
  }
}

// Singleton instance
export const meshProtocol = new MeshCoreProtocol();
