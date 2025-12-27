import { useState, useEffect, useCallback } from "react";
import { bleService, State, type BLEDevice } from "@/lib/ble-service";
import { meshProtocol, type MeshPacket } from "@/lib/meshcore-protocol";

export interface BluetoothState {
  isScanning: boolean;
  isConnected: boolean;
  connectedDevice: BLEDevice | null;
  discoveredDevices: BLEDevice[];
  bleState: any; // BLE State enum
  error: string | null;
}

export interface BluetoothActions {
  startScan: () => Promise<void>;
  stopScan: () => void;
  connect: (deviceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (to: string, text: string, channel?: number) => Promise<void>;
  sendPosition: (to: string, lat: number, lon: number) => Promise<void>;
  onMessageReceived: (callback: (packet: MeshPacket) => void) => () => void;
}

export function useBluetooth(): [BluetoothState, BluetoothActions] {
  // Check if BLE is available
  const bleAvailable = bleService.isAvailable();
  
  const [state, setState] = useState<BluetoothState>({
    isScanning: false,
    isConnected: false,
    connectedDevice: null,
    discoveredDevices: [],
    bleState: bleAvailable ? State.Unknown : State.Unsupported,
    error: bleAvailable ? null : "BLE requires development build",
  });

  const [messageCallbacks, setMessageCallbacks] = useState<Array<(packet: MeshPacket) => void>>(
    []
  );

  // Monitor BLE state
  useEffect(() => {
    const subscription = bleService.onStateChange((newState) => {
      setState((prev) => ({ ...prev, bleState: newState }));
    });

    // Get initial state
    bleService.getState().then((initialState) => {
      setState((prev) => ({ ...prev, bleState: initialState }));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Monitor incoming data
  useEffect(() => {
    const subscription = bleService.onDataReceived((data) => {
      console.log("[useBluetooth] Raw data received:", data);
      
      // Decode packet
      const packet = meshProtocol.decodePacket(data);
      if (packet) {
        console.log("[useBluetooth] Decoded packet:", packet);
        
        // Notify all callbacks
        messageCallbacks.forEach((callback) => callback(packet));
      }
    });

    return () => {
      subscription.remove();
    };
  }, [messageCallbacks]);

  // Start scanning for devices
  const startScan = useCallback(async () => {
    if (!bleAvailable) {
      console.warn("[useBluetooth] BLE not available");
      setState((prev) => ({ ...prev, error: "BLE requires development build" }));
      return;
    }
    
    try {
      setState((prev) => ({ ...prev, isScanning: true, error: null, discoveredDevices: [] }));

      await bleService.startScan((device) => {
        setState((prev) => {
          // Check if device already exists
          const exists = prev.discoveredDevices.some((d) => d.id === device.id);
          if (exists) {
            // Update existing device
            return {
              ...prev,
              discoveredDevices: prev.discoveredDevices.map((d) =>
                d.id === device.id ? device : d
              ),
            };
          } else {
            // Add new device
            return {
              ...prev,
              discoveredDevices: [...prev.discoveredDevices, device],
            };
          }
        });
      });
    } catch (error: any) {
      console.error("[useBluetooth] Scan error:", error);
      setState((prev) => ({
        ...prev,
        isScanning: false,
        error: error.message || "Failed to start scan",
      }));
    }
  }, []);

  // Stop scanning
  const stopScan = useCallback(() => {
    bleService.stopScan();
    setState((prev) => ({ ...prev, isScanning: false }));
  }, []);

  // Connect to a device
  const connect = useCallback(async (deviceId: string) => {
    if (!bleAvailable) {
      throw new Error("BLE not available - requires development build");
    }
    
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Stop scanning first
      if (state.isScanning) {
        stopScan();
      }

      const device = state.discoveredDevices.find((d) => d.id === deviceId);
      
      await bleService.connect(deviceId, (connected) => {
        setState((prev) => ({
          ...prev,
          isConnected: connected,
          connectedDevice: connected ? device || null : null,
        }));
      });

      console.log("[useBluetooth] Connected to device:", deviceId);
    } catch (error: any) {
      console.error("[useBluetooth] Connection error:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to connect",
      }));
    }
  }, [state.isScanning, state.discoveredDevices, stopScan]);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      await bleService.disconnect();
      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectedDevice: null,
      }));
      console.log("[useBluetooth] Disconnected");
    } catch (error: any) {
      console.error("[useBluetooth] Disconnect error:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to disconnect",
      }));
    }
  }, []);

  // Send a text message
  const sendMessage = useCallback(
    async (to: string, text: string, channel: number = 0) => {
      if (!bleAvailable) {
        throw new Error("BLE not available - requires development build");
      }
      
      try {
        if (!state.isConnected || !state.connectedDevice) {
          throw new Error("Not connected to a device");
        }

        const from = state.connectedDevice.id;
        const encodedPacket = meshProtocol.encodeTextMessage(from, to, text, channel);
        
        await bleService.sendData(encodedPacket);
        console.log("[useBluetooth] Message sent:", text);
      } catch (error: any) {
        console.error("[useBluetooth] Send message error:", error);
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to send message",
        }));
        throw error;
      }
    },
    [state.isConnected, state.connectedDevice]
  );

  // Send position update
  const sendPosition = useCallback(
    async (to: string, lat: number, lon: number) => {
      try {
        if (!state.isConnected || !state.connectedDevice) {
          throw new Error("Not connected to a device");
        }

        const from = state.connectedDevice.id;
        const encodedPacket = meshProtocol.encodePosition(from, to, lat, lon);
        
        await bleService.sendData(encodedPacket);
        console.log("[useBluetooth] Position sent:", lat, lon);
      } catch (error: any) {
        console.error("[useBluetooth] Send position error:", error);
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to send position",
        }));
        throw error;
      }
    },
    [state.isConnected, state.connectedDevice]
  );

  // Register callback for received messages
  const onMessageReceived = useCallback((callback: (packet: MeshPacket) => void) => {
    setMessageCallbacks((prev) => [...prev, callback]);
    
    return () => {
      setMessageCallbacks((prev) => prev.filter((cb) => cb !== callback));
    };
  }, []);

  const actions: BluetoothActions = {
    startScan,
    stopScan,
    connect,
    disconnect,
    sendMessage,
    sendPosition,
    onMessageReceived,
  };

  return [state, actions];
}
