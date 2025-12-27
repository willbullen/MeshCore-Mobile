// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi)
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons
  "house.fill": "home",
  "message.fill": "message",
  "antenna.radiowaves.left.and.right": "cell-tower",
  "map.fill": "map",
  "dot.radiowaves.left.and.right": "bluetooth",
  
  // Node type icons
  "person.fill": "person",
  "server.rack": "dns",
  "sensor.fill": "sensors",
  "iphone": "smartphone",
  
  // Action icons
  "paperplane.fill": "send",
  "plus": "add",
  "magnifyingglass": "search",
  "gearshape.fill": "settings",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "keyboard-arrow-down",
  "xmark": "close",
  
  // Status icons
  "checkmark.circle.fill": "check-circle",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "battery.100": "battery-full",
  "battery.75": "battery-6-bar",
  "battery.50": "battery-4-bar",
  "battery.25": "battery-2-bar",
  "wifi": "wifi",
  "location.fill": "location-on",
  
  // Misc icons
  "ellipsis": "more-horiz",
  "trash.fill": "delete",
  "square.and.arrow.up": "share",
  "questionmark.circle.fill": "help",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
