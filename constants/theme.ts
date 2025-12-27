/**
 * MeshCore Mobile App Theme
 * Black and dark blue color scheme matching the web application
 */

import { Platform } from "react-native";

const tintColorLight = "#3b82f6"; // Bright blue
const tintColorDark = "#3b82f6";  // Bright blue

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    textDisabled: "#9CA3AF",
    background: "#fff",
    surface: "#f3f4f6",
    tint: tintColorLight,
    primary: tintColorLight,
    secondary: "#1e40af",
    accent: "#60a5fa",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    border: "#e5e7eb",
    card: "#f9fafb",
  },
  dark: {
    // MeshCore brand colors
    text: "#ffffff",              // White
    textSecondary: "#94a3b8",     // Muted gray
    textDisabled: "#64748b",      // Darker gray
    background: "#0a0a0a",        // True black
    surface: "#1a1a2e",           // Dark blue-black
    tint: "#3b82f6",              // Bright blue
    primary: "#3b82f6",           // Bright blue
    secondary: "#1e40af",         // Deep blue
    accent: "#60a5fa",            // Light blue
    icon: "#94a3b8",              // Muted gray
    tabIconDefault: "#64748b",    // Darker gray
    tabIconSelected: "#3b82f6",   // Bright blue
    success: "#22c55e",           // Green
    warning: "#f59e0b",           // Amber
    error: "#ef4444",             // Red
    info: "#3b82f6",              // Blue
    border: "#1e293b",            // Dark border
    card: "#1a1a2e",              // Card background
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "normal" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: "normal" as const,
    lineHeight: 16,
  },
};
