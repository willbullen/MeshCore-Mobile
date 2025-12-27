import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  rssi: number;
}

const mockBluetoothDevices: BluetoothDevice[] = [
  { id: "1", name: "RAK4631-A1B2", address: "00:11:22:33:44:55", rssi: -45 },
  { id: "2", name: "RAK4631-C3D4", address: "AA:BB:CC:DD:EE:FF", rssi: -68 },
  { id: "3", name: "Heltec-V3", address: "11:22:33:44:55:66", rssi: -75 },
];

export default function ConnectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  
  // Settings state
  const [nodeName, setNodeName] = useState("Base Station");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setDiscoveredDevices(mockBluetoothDevices);
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = (device: BluetoothDevice) => {
    setConnectedDevice(device);
    setIsConnected(true);
    setDiscoveredDevices([]);
  };

  const handleDisconnect = () => {
    setConnectedDevice(null);
    setIsConnected(false);
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return "Excellent";
    if (rssi > -70) return "Good";
    return "Fair";
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, 20),
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <ThemedText type="title">Connect</ThemedText>
        </View>

        {/* Connection Status Card */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Connection Status
          </ThemedText>
          
          <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: isConnected ? colors.success : colors.textDisabled,
                  },
                ]}
              />
              <ThemedText type="defaultSemiBold">
                {isConnected ? "Connected" : "Disconnected"}
              </ThemedText>
            </View>

            {isConnected && connectedDevice ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Device
                    </ThemedText>
                    <ThemedText type="defaultSemiBold">{connectedDevice.name}</ThemedText>
                  </View>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Type
                    </ThemedText>
                    <ThemedText>Bluetooth</ThemedText>
                  </View>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Signal
                    </ThemedText>
                    <ThemedText>{getSignalStrength(connectedDevice.rssi)}</ThemedText>
                  </View>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: colors.error },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={handleDisconnect}
                >
                  <ThemedText style={styles.actionButtonText}>Disconnect</ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                <ThemedText style={[styles.statusDescription, { color: colors.textSecondary }]}>
                  No device connected. Scan for nearby devices to connect.
                </ThemedText>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={handleScan}
                  disabled={isScanning}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {isScanning ? "Scanning..." : "Scan for Devices"}
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Discovered Devices */}
        {discoveredDevices.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Nearby Devices
            </ThemedText>
            
            {discoveredDevices.map((device) => (
              <Pressable
                key={device.id}
                style={({ pressed }) => [
                  styles.deviceCard,
                  { backgroundColor: colors.surface },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleConnect(device)}
              >
                <View style={styles.deviceCardContent}>
                  <IconSymbol
                    name="dot.radiowaves.left.and.right"
                    size={24}
                    color={colors.primary}
                  />
                  <View style={styles.deviceCardInfo}>
                    <ThemedText type="defaultSemiBold">{device.name}</ThemedText>
                    <ThemedText style={[styles.deviceAddress, { color: colors.textSecondary }]}>
                      {device.address}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.deviceRssi, { color: colors.textSecondary }]}>
                    {device.rssi} dBm
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* User Profile */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            User Profile
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.profileRow}>
              <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.profileAvatarText}>
                  {nodeName.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.profileContent}>
                <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Node Name
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={nodeName}
                  onChangeText={setNodeName}
                  placeholder="Enter node name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preferences
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="bell.fill" size={20} color={colors.textSecondary} />
                <ThemedText>Notifications</ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.textDisabled, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="wifi" size={20} color={colors.textSecondary} />
                <ThemedText>Sound</ThemedText>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.textDisabled, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="info.circle.fill" size={20} color={colors.textSecondary} />
                <ThemedText>Keep Screen On</ThemedText>
              </View>
              <Switch
                value={keepScreenOn}
                onValueChange={setKeepScreenOn}
                trackColor={{ false: colors.textDisabled, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            About
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.aboutRow}>
              <ThemedText style={{ color: colors.textSecondary }}>Version</ThemedText>
              <ThemedText>1.0.0</ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Pressable
              style={({ pressed }) => [
                styles.aboutRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => Linking.openURL("https://github.com/willbullen/MeshCore-Bridge")}
            >
              <ThemedText style={{ color: colors.textSecondary }}>GitHub</ThemedText>
              <View style={styles.aboutRowRight}>
                <ThemedText style={{ color: colors.primary }}>View Repository</ThemedText>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </View>
            </Pressable>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Pressable
              style={({ pressed }) => [
                styles.aboutRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => Linking.openURL("https://github.com/willbullen/MeshCore-Bridge#readme")}
            >
              <ThemedText style={{ color: colors.textSecondary }}>Documentation</ThemedText>
              <View style={styles.aboutRowRight}>
                <ThemedText style={{ color: colors.primary }}>Read Docs</ThemedText>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  statusCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  deviceInfo: {
    gap: Spacing.sm,
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deviceLabel: {
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  deviceCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  deviceCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  deviceCardInfo: {
    flex: 1,
  },
  deviceAddress: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "monospace",
  },
  deviceRssi: {
    fontSize: 12,
  },
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  profileRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: 13,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  divider: {
    height: 1,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aboutRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
