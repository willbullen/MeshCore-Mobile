import { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { State } from "@/lib/ble-service";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBluetooth } from "@/hooks/use-bluetooth";

export default function ConnectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const insets = useSafeAreaInsets();
  
  const [bluetoothState, bluetoothActions] = useBluetooth();
  const bleAvailable = bluetoothState.bleState !== State.Unsupported;
  
  // Settings state
  const [nodeName, setNodeName] = useState("Base Station");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(false);

  // Monitor Bluetooth state
  useEffect(() => {
    if (bluetoothState.bleState === State.PoweredOff) {
      Alert.alert(
        "Bluetooth Off",
        "Please enable Bluetooth to connect to mesh devices.",
        [{ text: "OK" }]
      );
    }
  }, [bluetoothState.bleState]);

  // Show error alerts
  useEffect(() => {
    if (bluetoothState.error) {
      Alert.alert("Bluetooth Error", bluetoothState.error, [{ text: "OK" }]);
    }
  }, [bluetoothState.error]);

  const handleScan = async () => {
    try {
      await bluetoothActions.startScan();
      // Auto-stop scan after 30 seconds
      setTimeout(() => {
        if (bluetoothState.isScanning) {
          bluetoothActions.stopScan();
        }
      }, 30000);
    } catch (error: any) {
      Alert.alert("Scan Failed", error.message || "Could not start scanning");
    }
  };

  const handleConnect = async (deviceId: string) => {
    try {
      await bluetoothActions.connect(deviceId);
      Alert.alert("Connected", "Successfully connected to device");
    } catch (error: any) {
      Alert.alert("Connection Failed", error.message || "Could not connect to device");
    }
  };

  const handleDisconnect = async () => {
    try {
      await bluetoothActions.disconnect();
    } catch (error: any) {
      Alert.alert("Disconnect Failed", error.message || "Could not disconnect");
    }
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return "Excellent";
    if (rssi > -70) return "Good";
    return "Fair";
  };

  const getBleStateText = (state: any) => {
    switch (state) {
      case State.PoweredOn:
        return "Ready";
      case State.PoweredOff:
        return "Bluetooth Off";
      case State.Unauthorized:
        return "No Permission";
      case State.Unsupported:
        return "Not Supported";
      default:
        return "Unknown";
    }
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
          <ThemedText style={[styles.bleState, { color: colors.textSecondary }]}>
            {getBleStateText(bluetoothState.bleState)}
          </ThemedText>
        </View>

        {/* BLE Unavailable Warning */}
        {!bleAvailable && (
          <View style={styles.section}>
            <View style={[styles.statusCard, { backgroundColor: colors.error + "20", borderWidth: 1, borderColor: colors.error }]}>
              <View style={styles.statusHeader}>
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.error} />
                <ThemedText type="defaultSemiBold" style={{ color: colors.error }}>
                  Development Build Required
                </ThemedText>
              </View>
              <ThemedText style={[styles.statusDescription, { color: colors.text }]}>
                Bluetooth features require a development build. Expo Go doesn't support native BLE modules.
              </ThemedText>
              <ThemedText style={[styles.statusDescription, { color: colors.textSecondary, fontSize: 13 }]}>
                Run: npx expo run:ios or npx expo run:android
              </ThemedText>
            </View>
          </View>
        )}

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
                    backgroundColor: bluetoothState.isConnected
                      ? colors.success
                      : colors.textDisabled,
                  },
                ]}
              />
              <ThemedText type="defaultSemiBold">
                {bluetoothState.isConnected ? "Connected" : "Disconnected"}
              </ThemedText>
            </View>

            {bluetoothState.isConnected && bluetoothState.connectedDevice ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Device
                    </ThemedText>
                    <ThemedText type="defaultSemiBold">
                      {bluetoothState.connectedDevice.name}
                    </ThemedText>
                  </View>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Type
                    </ThemedText>
                    <ThemedText>Bluetooth LE</ThemedText>
                  </View>
                  <View style={styles.deviceRow}>
                    <ThemedText style={[styles.deviceLabel, { color: colors.textSecondary }]}>
                      Signal
                    </ThemedText>
                    <ThemedText>
                      {getSignalStrength(bluetoothState.connectedDevice.rssi)}
                    </ThemedText>
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
                  No device connected. Scan for nearby mesh devices to connect.
                </ThemedText>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.8 },
                    bluetoothState.isScanning && { opacity: 0.6 },
                  ]}
                  onPress={handleScan}
                  disabled={bluetoothState.isScanning || bluetoothState.bleState !== State.PoweredOn}
                >
                  {bluetoothState.isScanning ? (
                    <View style={styles.scanningRow}>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <ThemedText style={styles.actionButtonText}>Scanning...</ThemedText>
                    </View>
                  ) : (
                    <ThemedText style={styles.actionButtonText}>Scan for Devices</ThemedText>
                  )}
                </Pressable>
                {bluetoothState.isScanning && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.stopButton,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={bluetoothActions.stopScan}
                  >
                    <ThemedText style={{ color: colors.text }}>Stop Scan</ThemedText>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>

        {/* Discovered Devices */}
        {bluetoothState.discoveredDevices.length > 0 && !bluetoothState.isConnected && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Nearby Devices ({bluetoothState.discoveredDevices.length})
            </ThemedText>
            
            {bluetoothState.discoveredDevices.map((device) => (
              <Pressable
                key={device.id}
                style={({ pressed }) => [
                  styles.deviceCard,
                  { backgroundColor: colors.surface },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleConnect(device.id)}
              >
                <View style={styles.deviceCardContent}>
                  <IconSymbol
                    name="dot.radiowaves.left.and.right"
                    size={24}
                    color={colors.primary}
                  />
                  <View style={styles.deviceCardInfo}>
                    <ThemedText type="defaultSemiBold">{device.name || "Unknown"}</ThemedText>
                    <ThemedText style={[styles.deviceAddress, { color: colors.textSecondary }]}>
                      {device.id.substring(0, 17)}
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
              onPress={() => Linking.openURL("https://github.com/willbullen/MeshCore-Mobile")}
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
              onPress={() =>
                Linking.openURL("https://github.com/willbullen/MeshCore-Mobile#readme")
              }
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bleState: {
    fontSize: 13,
    fontWeight: "600",
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
  scanningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  stopButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    marginTop: Spacing.sm,
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
