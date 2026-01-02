/**
 * Web Bluetooth Service
 * 
 * Implements BLE connectivity for web browsers using the Web Bluetooth API.
 * Works in Chrome, Edge, and Opera browsers.
 */

// Web Bluetooth API types
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  value?: DataView;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  writeValue(value: BufferSource): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

// MeshCore BLE Service UUIDs
const MESHCORE_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Write
const RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // Notify

export interface BLEDevice {
  id: string;
  name: string | null;
  rssi: number;
}

export type BLEStateCallback = (state: string) => void;
export type DeviceDiscoveredCallback = (device: BLEDevice) => void;
export type DataReceivedCallback = (data: string) => void;
export type ConnectionStateCallback = (connected: boolean) => void;

export const State = {
  Unknown: 'Unknown',
  Resetting: 'Resetting',
  Unsupported: 'Unsupported',
  Unauthorized: 'Unauthorized',
  PoweredOff: 'PoweredOff',
  PoweredOn: 'PoweredOn',
};

class WebBLEService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private dataCallbacks: DataReceivedCallback[] = [];
  private connectionCallbacks: ConnectionStateCallback[] = [];
  private characteristicListener: ((event: any) => void) | null = null;

  /**
   * Check if Web Bluetooth is available
   */
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * Get BLE state
   */
  async getState(): Promise<string> {
    if (!this.isAvailable()) {
      return State.Unsupported;
    }

    // Web Bluetooth doesn't have a direct way to check if Bluetooth is on
    // We can only check availability
    try {
      const available = await (navigator as any).bluetooth.getAvailability();
      return available ? State.PoweredOn : State.PoweredOff;
    } catch (error) {
      return State.Unknown;
    }
  }

  /**
   * Request permissions (not needed for web - handled by browser)
   */
  async requestPermissions(): Promise<boolean> {
    // Web Bluetooth handles permissions automatically during requestDevice()
    return this.isAvailable();
  }

  /**
   * Start scanning for devices
   * Note: Web Bluetooth requires user interaction (button click) to trigger scan
   */
  async startScan(onDeviceDiscovered: DeviceDiscoveredCallback): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Web Bluetooth not supported in this browser. Use Chrome, Edge, or Opera.');
    }

    try {
      console.log('[WebBLE] Requesting device...');

      // Request device with filters
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { namePrefix: 'RAK' },
          { namePrefix: 'Mesh' },
          { namePrefix: 'Heltec' },
        ],
        optionalServices: [MESHCORE_SERVICE_UUID],
      });

      console.log('[WebBLE] Device selected:', device.name);

      // Notify callback
      onDeviceDiscovered({
        id: device.id,
        name: device.name || null,
        rssi: -70, // Web Bluetooth doesn't expose RSSI
      });

      // Store device for connection
      this.device = device;
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        console.log('[WebBLE] No device selected');
        return;
      }
      console.error('[WebBLE] Scan error:', error);
      throw error;
    }
  }

  /**
   * Stop scanning (no-op for web - scan ends when device is selected)
   */
  stopScan(): void {
    console.log('[WebBLE] Stop scan (no-op for web)');
  }

  /**
   * Connect to a device
   */
  async connect(deviceId: string, onConnectionStateChange: ConnectionStateCallback): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('Web Bluetooth not supported');
    }

    if (!this.device) {
      throw new Error('No device selected. Call startScan first.');
    }

    try {
      console.log('[WebBLE] Connecting to device...');

      this.connectionCallbacks.push(onConnectionStateChange);

      // Connect to GATT server
      this.server = await this.device.gatt!.connect();
      console.log('[WebBLE] Connected to GATT server');

      // Get MeshCore service
      const service = await this.server.getPrimaryService(MESHCORE_SERVICE_UUID);
      console.log('[WebBLE] Got MeshCore service');

      // Get characteristics
      this.txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);
      this.rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);
      console.log('[WebBLE] Got characteristics');

      // Setup notifications
      await this.setupNotifications();

      onConnectionStateChange(true);
      console.log('[WebBLE] Connection successful');

      return this.device;
    } catch (error) {
      console.error('[WebBLE] Connection error:', error);
      onConnectionStateChange(false);
      throw error;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    console.log('[WebBLE] Disconnecting...');

    if (this.rxCharacteristic && this.characteristicListener) {
      this.rxCharacteristic.removeEventListener(
        'characteristicvaluechanged',
        this.characteristicListener
      );
      this.characteristicListener = null;
    }

    if (this.server) {
      this.server.disconnect();
      this.server = null;
    }

    this.device = null;
    this.txCharacteristic = null;
    this.rxCharacteristic = null;

    this.connectionCallbacks.forEach(cb => cb(false));
    this.connectionCallbacks = [];
    this.dataCallbacks = [];
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.server !== null && this.server.connected;
  }

  /**
   * Get connected device
   */
  getConnectedDevice(): any {
    return this.device;
  }

  /**
   * Setup notifications for incoming data
   */
  private async setupNotifications(): Promise<void> {
    if (!this.rxCharacteristic) {
      throw new Error('RX characteristic not available');
    }

    console.log('[WebBLE] Setting up notifications...');

    await this.rxCharacteristic.startNotifications();

    // Create listener function
    this.characteristicListener = (event: any) => {
      const value = event.target.value as DataView;
      
      // Convert DataView to Uint8Array
      const bytes = new Uint8Array(value.buffer);
      
      // Convert to string
      const data = new TextDecoder().decode(bytes);
      
      console.log('[WebBLE] Received data:', data);
      this.dataCallbacks.forEach(cb => cb(data));
    };

    this.rxCharacteristic.addEventListener(
      'characteristicvaluechanged',
      this.characteristicListener
    );
  }

  /**
   * Send data to device
   */
  async sendData(data: string): Promise<void> {
    if (!this.isConnected() || !this.txCharacteristic) {
      throw new Error('Not connected to device');
    }

    console.log('[WebBLE] Sending data:', data);

    try {
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      const bytes = encoder.encode(data);

      // Write to characteristic
      await this.txCharacteristic.writeValue(bytes);
      console.log('[WebBLE] Data sent successfully');
    } catch (error) {
      console.error('[WebBLE] Send error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: BLEStateCallback): { remove: () => void } {
    // Web Bluetooth doesn't have state change events
    // Call callback with current state
    this.getState().then(callback);

    return {
      remove: () => {
        // No-op for web
      },
    };
  }

  /**
   * Subscribe to received data
   */
  onDataReceived(callback: DataReceivedCallback): { remove: () => void } {
    this.dataCallbacks.push(callback);

    return {
      remove: () => {
        this.dataCallbacks = this.dataCallbacks.filter(cb => cb !== callback);
      },
    };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    console.log('[WebBLE] Destroying service...');
    this.disconnect();
  }
}

// Export singleton instance
export const bleService = new WebBLEService();
export { WebBLEService };
