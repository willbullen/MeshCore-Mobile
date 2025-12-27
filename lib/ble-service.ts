import { Platform, PermissionsAndroid } from "react-native";

// Dynamically import BLE to handle missing native module gracefully
let BleManager: any;
let State: any;
let BLE_AVAILABLE = false;

try {
  const ble = require("react-native-ble-plx");
  BleManager = ble.BleManager;
  State = ble.State;
  BLE_AVAILABLE = true;
} catch (error) {
  console.warn("[BLE] react-native-ble-plx not available. BLE features disabled.");
  // Mock State enum for when BLE is not available
  State = {
    Unknown: "Unknown",
    Resetting: "Resetting",
    Unsupported: "Unsupported",
    Unauthorized: "Unauthorized",
    PoweredOff: "PoweredOff",
    PoweredOn: "PoweredOn",
  };
}

type Device = any;
type Subscription = any;

// MeshCore BLE Service UUIDs (adjust these to match your RAK4631 configuration)
const MESHCORE_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"; // Nordic UART Service
const TX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // Write
const RX_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // Notify

export { State };

export interface BLEDevice {
  id: string;
  name: string | null;
  rssi: number;
}

export type BLEStateCallback = (state: any) => void;
export type DeviceDiscoveredCallback = (device: BLEDevice) => void;
export type DataReceivedCallback = (data: string) => void;
export type ConnectionStateCallback = (connected: boolean) => void;

class BLEService {
  private manager: any = null;
  private connectedDevice: Device | null = null;
  private scanSubscription: Subscription | null = null;
  private notificationSubscription: Subscription | null = null;
  private stateCallbacks: BLEStateCallback[] = [];
  private deviceCallbacks: DeviceDiscoveredCallback[] = [];
  private dataCallbacks: DataReceivedCallback[] = [];
  private connectionCallbacks: ConnectionStateCallback[] = [];

  constructor() {
    if (!BLE_AVAILABLE || !BleManager) {
      console.warn("[BLE] BleManager not available, BLE features disabled");
      return;
    }

    try {
      this.manager = new BleManager();
      this.setupStateListener();
    } catch (error) {
      console.error("[BLE] Failed to initialize BleManager:", error);
    }
  }

  isAvailable(): boolean {
    return BLE_AVAILABLE && this.manager !== null;
  }

  private setupStateListener() {
    if (!this.manager) return;
    
    this.manager.onStateChange((state: any) => {
      console.log("[BLE] State changed:", state);
      this.stateCallbacks.forEach((cb) => cb(state));
    }, true);
  }

  // Permission handling
  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn("[BLE] BLE not available, cannot request permissions");
      return false;
    }

    if (Platform.OS === "android") {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          granted["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below - just request location
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    // iOS permissions are handled via Info.plist
    return true;
  }

  // State management
  async getState(): Promise<any> {
    if (!this.manager) {
      return State.Unsupported;
    }
    return await this.manager.state();
  }

  onStateChange(callback: BLEStateCallback): Subscription {
    this.stateCallbacks.push(callback);
    return {
      remove: () => {
        this.stateCallbacks = this.stateCallbacks.filter((cb) => cb !== callback);
      },
    };
  }

  // Device scanning
  async startScan(onDeviceDiscovered: DeviceDiscoveredCallback): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error("BLE not available - requires development build");
    }

    console.log("[BLE] Starting scan...");
    
    // Request permissions first
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      console.error("[BLE] Permissions not granted");
      throw new Error("Bluetooth permissions not granted");
    }

    // Check BLE state
    const state = await this.getState();
    if (state !== State.PoweredOn) {
      console.error("[BLE] Bluetooth is not powered on:", state);
      throw new Error(`Bluetooth is ${state}`);
    }

    this.deviceCallbacks.push(onDeviceDiscovered);

    this.scanSubscription = this.manager.startDeviceScan(
      null, // Scan for all devices
      { allowDuplicates: false },
      (error: any, device: any) => {
        if (error) {
          console.error("[BLE] Scan error:", error);
          return;
        }

        if (device && device.name) {
          // Filter for MeshCore devices (adjust filter as needed)
          if (
            device.name.includes("RAK") ||
            device.name.includes("Mesh") ||
            device.name.includes("Heltec")
          ) {
            console.log("[BLE] Discovered device:", device.name, device.id);
            const bleDevice: BLEDevice = {
              id: device.id,
              name: device.name,
              rssi: device.rssi || -100,
            };
            this.deviceCallbacks.forEach((cb) => cb(bleDevice));
          }
        }
      }
    );
  }

  stopScan() {
    if (!this.manager) return;
    
    console.log("[BLE] Stopping scan...");
    if (this.scanSubscription) {
      this.scanSubscription.remove();
      this.scanSubscription = null;
    }
    this.manager.stopDeviceScan();
    this.deviceCallbacks = [];
  }

  // Connection management
  async connect(deviceId: string, onConnectionStateChange: ConnectionStateCallback) {
    if (!this.isAvailable()) {
      throw new Error("BLE not available - requires development build");
    }

    console.log("[BLE] Connecting to device:", deviceId);
    
    try {
      // Disconnect any existing connection
      if (this.connectedDevice) {
        await this.disconnect();
      }

      this.connectionCallbacks.push(onConnectionStateChange);

      // Connect to device
      const device = await this.manager.connectToDevice(deviceId, {
        autoConnect: false,
        requestMTU: 512,
      });

      console.log("[BLE] Connected to:", device.name);
      this.connectedDevice = device;

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();
      console.log("[BLE] Services discovered");

      // Setup notifications for incoming data
      await this.setupNotifications();

      onConnectionStateChange(true);
      return device;
    } catch (error) {
      console.error("[BLE] Connection error:", error);
      this.connectedDevice = null;
      onConnectionStateChange(false);
      throw error;
    }
  }

  async disconnect() {
    if (!this.manager) return;
    
    console.log("[BLE] Disconnecting...");
    
    if (this.notificationSubscription) {
      this.notificationSubscription.remove();
      this.notificationSubscription = null;
    }

    if (this.connectedDevice) {
      try {
        await this.manager.cancelDeviceConnection(this.connectedDevice.id);
      } catch (error) {
        console.error("[BLE] Disconnect error:", error);
      }
      this.connectedDevice = null;
    }

    this.connectionCallbacks.forEach((cb) => cb(false));
    this.connectionCallbacks = [];
    this.dataCallbacks = [];
  }

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDevice(): Device | null {
    return this.connectedDevice;
  }

  // Data transmission
  private async setupNotifications() {
    if (!this.connectedDevice) {
      throw new Error("No device connected");
    }

    console.log("[BLE] Setting up notifications...");

    this.notificationSubscription = this.connectedDevice.monitorCharacteristicForService(
      MESHCORE_SERVICE_UUID,
      RX_CHARACTERISTIC_UUID,
      (error: any, characteristic: any) => {
        if (error) {
          console.error("[BLE] Notification error:", error);
          return;
        }

        if (characteristic?.value) {
          // Decode base64 data
          const data = Buffer.from(characteristic.value, "base64").toString("utf-8");
          console.log("[BLE] Received data:", data);
          this.dataCallbacks.forEach((cb) => cb(data));
        }
      }
    );
  }

  onDataReceived(callback: DataReceivedCallback): Subscription {
    this.dataCallbacks.push(callback);
    return {
      remove: () => {
        this.dataCallbacks = this.dataCallbacks.filter((cb) => cb !== callback);
      },
    };
  }

  async sendData(data: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error("BLE not available - requires development build");
    }

    if (!this.connectedDevice) {
      throw new Error("No device connected");
    }

    console.log("[BLE] Sending data:", data);

    // Encode data to base64
    const base64Data = Buffer.from(data, "utf-8").toString("base64");

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        MESHCORE_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        base64Data
      );
      console.log("[BLE] Data sent successfully");
    } catch (error) {
      console.error("[BLE] Send error:", error);
      throw error;
    }
  }

  // Cleanup
  destroy() {
    if (!this.manager) return;
    
    console.log("[BLE] Destroying BLE service...");
    this.stopScan();
    this.disconnect();
    this.manager.destroy();
  }
}

// Singleton instance
export const bleService = new BLEService();
