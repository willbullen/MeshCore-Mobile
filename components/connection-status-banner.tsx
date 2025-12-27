import { StyleSheet, View } from "react-native";
import { State } from "react-native-ble-plx";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBluetooth } from "@/hooks/use-bluetooth";

export function ConnectionStatusBanner() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [bluetoothState] = useBluetooth();

  // Don't show banner if connected and Bluetooth is on
  if (bluetoothState.isConnected && bluetoothState.bleState === State.PoweredOn) {
    return null;
  }

  // Determine banner message and color
  let message = "";
  let backgroundColor = colors.warning;
  let iconName: any = "wifi.slash";

  if (bluetoothState.bleState === State.PoweredOff) {
    message = "Bluetooth is off. Turn on Bluetooth to connect.";
    backgroundColor = colors.error;
    iconName = "wifi.slash";
  } else if (bluetoothState.bleState === State.Unauthorized) {
    message = "Bluetooth permission required. Grant permission in Settings.";
    backgroundColor = colors.error;
    iconName = "exclamationmark.triangle.fill";
  } else if (bluetoothState.isScanning) {
    message = "Scanning for devices...";
    backgroundColor = colors.primary;
    iconName = "dot.radiowaves.left.and.right";
  } else if (!bluetoothState.isConnected) {
    message = "Not connected to mesh network";
    backgroundColor = colors.warning;
    iconName = "wifi.slash";
  }

  if (!message) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor }]}>
      <IconSymbol name={iconName} size={16} color="#ffffff" />
      <ThemedText style={styles.bannerText}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  bannerText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});
