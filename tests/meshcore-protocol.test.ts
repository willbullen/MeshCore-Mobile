import { describe, it, expect } from 'vitest';
import { meshProtocol, PacketType, type MeshPacket } from '../lib/meshcore-protocol';

describe('MeshCore Protocol', () => {
  describe('Text Message Encoding/Decoding', () => {
    it('should encode and decode a text message', () => {
      const from = 'node123';
      const to = 'node456';
      const text = 'Hello, MeshCore!';
      const channel = 0;

      // Encode message
      const encoded = meshProtocol.encodeTextMessage(from, to, text, channel);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');

      // Decode message
      const decoded = meshProtocol.decodePacket(encoded);
      expect(decoded).toBeTruthy();
      expect(decoded?.type).toBe(PacketType.TEXT_MESSAGE);
      expect(decoded?.from).toBe(from);
      expect(decoded?.to).toBe(to);

      // Decode text payload
      const textPayload = meshProtocol.decodeTextMessage(decoded as MeshPacket);
      expect(textPayload).toBeTruthy();
      expect(textPayload?.text).toBe(text);
      expect(textPayload?.channel).toBe(channel);
    });

    it('should handle empty text messages', () => {
      const encoded = meshProtocol.encodeTextMessage('a', 'b', '', 0);
      const decoded = meshProtocol.decodePacket(encoded);
      const textPayload = meshProtocol.decodeTextMessage(decoded as MeshPacket);
      
      expect(textPayload?.text).toBe('');
    });

    it('should handle long text messages', () => {
      const longText = 'A'.repeat(500);
      const encoded = meshProtocol.encodeTextMessage('a', 'b', longText, 0);
      const decoded = meshProtocol.decodePacket(encoded);
      const textPayload = meshProtocol.decodeTextMessage(decoded as MeshPacket);
      
      expect(textPayload?.text).toBe(longText);
    });
  });

  describe('Position Encoding/Decoding', () => {
    it('should encode and decode position data', () => {
      const from = 'node123';
      const to = 'broadcast';
      const latitude = 37.7749;
      const longitude = -122.4194;
      const altitude = 15;
      const accuracy = 10;

      const encoded = meshProtocol.encodePosition(from, to, latitude, longitude, altitude, accuracy);
      const decoded = meshProtocol.decodePacket(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.type).toBe(PacketType.POSITION);

      const posPayload = meshProtocol.decodePosition(decoded as MeshPacket);
      expect(posPayload).toBeTruthy();
      expect(posPayload?.latitude).toBe(latitude);
      expect(posPayload?.longitude).toBe(longitude);
      expect(posPayload?.altitude).toBe(altitude);
      expect(posPayload?.accuracy).toBe(accuracy);
    });

    it('should handle position without altitude', () => {
      const encoded = meshProtocol.encodePosition('a', 'b', 10, 20);
      const decoded = meshProtocol.decodePacket(encoded);
      const posPayload = meshProtocol.decodePosition(decoded as MeshPacket);
      
      expect(posPayload?.latitude).toBe(10);
      expect(posPayload?.longitude).toBe(20);
      expect(posPayload?.altitude).toBeUndefined();
    });
  });

  describe('Telemetry Encoding/Decoding', () => {
    it('should encode and decode telemetry data', () => {
      const from = 'node123';
      const to = 'server';
      const telemetry = {
        batteryLevel: 85,
        voltage: 3.7,
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
      };

      const encoded = meshProtocol.encodeTelemetry(from, to, telemetry);
      const decoded = meshProtocol.decodePacket(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.type).toBe(PacketType.TELEMETRY);

      const telPayload = meshProtocol.decodeTelemetry(decoded as MeshPacket);
      expect(telPayload).toBeTruthy();
      expect(telPayload?.batteryLevel).toBe(telemetry.batteryLevel);
      expect(telPayload?.temperature).toBe(telemetry.temperature);
      expect(telPayload?.humidity).toBe(telemetry.humidity);
    });
  });

  describe('ACK Encoding/Decoding', () => {
    it('should encode and decode acknowledgment', () => {
      const from = 'node123';
      const to = 'node456';
      const packetId = 12345;
      const success = true;

      const encoded = meshProtocol.encodeAck(from, to, packetId, success);
      const decoded = meshProtocol.decodePacket(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.type).toBe(PacketType.ACK);

      const ackPayload = meshProtocol.decodeAck(decoded as MeshPacket);
      expect(ackPayload).toBeTruthy();
      expect(ackPayload?.packetId).toBe(packetId);
      expect(ackPayload?.success).toBe(success);
    });
  });

  describe('Ping Encoding/Decoding', () => {
    it('should encode and decode ping packet', () => {
      const from = 'node123';
      const to = 'node456';

      const encoded = meshProtocol.encodePing(from, to);
      const decoded = meshProtocol.decodePacket(encoded);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.type).toBe(PacketType.PING);
      expect(decoded?.from).toBe(from);
      expect(decoded?.to).toBe(to);
    });
  });

  describe('Error Handling', () => {
    it('should return null for invalid data', () => {
      const decoded = meshProtocol.decodePacket('invalid-data');
      expect(decoded).toBeNull();
    });

    it('should return null for data too short', () => {
      const decoded = meshProtocol.decodePacket('AA=='); // Just 1 byte when base64 decoded
      expect(decoded).toBeNull();
    });

    it('should return null for wrong packet type in decoder', () => {
      // Encode as text message
      const encoded = meshProtocol.encodeTextMessage('a', 'b', 'test', 0);
      const decoded = meshProtocol.decodePacket(encoded);
      
      // Try to decode as position
      const posPayload = meshProtocol.decodePosition(decoded as MeshPacket);
      expect(posPayload).toBeNull();
    });
  });

  describe('CRC Validation', () => {
    it('should detect corrupted data', () => {
      const encoded = meshProtocol.encodeTextMessage('a', 'b', 'test', 0);
      
      // Corrupt the last byte (CRC)
      const buffer = Buffer.from(encoded, 'base64');
      buffer[buffer.length - 1] = buffer[buffer.length - 1] ^ 0xFF;
      const corrupted = buffer.toString('base64');
      
      const decoded = meshProtocol.decodePacket(corrupted);
      expect(decoded).toBeNull();
    });
  });

  describe('Packet ID Generation', () => {
    it('should generate unique packet IDs', () => {
      const packet1 = meshProtocol.encodeTextMessage('a', 'b', 'msg1', 0);
      const packet2 = meshProtocol.encodeTextMessage('a', 'b', 'msg2', 0);
      
      const decoded1 = meshProtocol.decodePacket(packet1);
      const decoded2 = meshProtocol.decodePacket(packet2);
      
      expect(decoded1?.id).toBeDefined();
      expect(decoded2?.id).toBeDefined();
      expect(decoded1?.id).not.toBe(decoded2?.id);
    });
  });
});
