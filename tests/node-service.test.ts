import { describe, it, expect } from 'vitest';
import { nodeService } from '../lib/node-service';

describe('Node Service', () => {
  describe('Signal Quality', () => {
    it('should classify excellent signal', () => {
      expect(nodeService.getSignalQuality(-40)).toBe('excellent');
      expect(nodeService.getSignalQuality(-50)).toBe('excellent');
    });

    it('should classify good signal', () => {
      expect(nodeService.getSignalQuality(-55)).toBe('good');
      expect(nodeService.getSignalQuality(-70)).toBe('good');
    });

    it('should classify fair signal', () => {
      expect(nodeService.getSignalQuality(-75)).toBe('fair');
      expect(nodeService.getSignalQuality(-85)).toBe('fair');
    });

    it('should classify poor signal', () => {
      expect(nodeService.getSignalQuality(-90)).toBe('poor');
      expect(nodeService.getSignalQuality(-100)).toBe('poor');
    });
  });

  describe('Battery Color', () => {
    it('should return green for high battery', () => {
      expect(nodeService.getBatteryColor(100)).toBe('#22c55e');
      expect(nodeService.getBatteryColor(60)).toBe('#22c55e');
    });

    it('should return amber for medium battery', () => {
      expect(nodeService.getBatteryColor(50)).toBe('#f59e0b');
      expect(nodeService.getBatteryColor(30)).toBe('#f59e0b');
    });

    it('should return red for low battery', () => {
      expect(nodeService.getBatteryColor(20)).toBe('#ef4444');
      expect(nodeService.getBatteryColor(5)).toBe('#ef4444');
    });
  });
});
