import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const AUTH_KEY = "@meshcore_authenticated";

interface BiometricLoginProps {
  onAuthenticated: () => void;
}

export function BiometricLogin({ onAuthenticated }: BiometricLoginProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 500 });

    // Check biometric support
    checkBiometricSupport();

    // Check if already authenticated
    checkAuthStatus();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          setError("No biometric data enrolled on device");
          return;
        }

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Fingerprint");
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType("Iris");
        } else {
          setBiometricType("Biometric");
        }
      } else {
        setError("Biometric authentication not supported on this device");
      }
    } catch (err) {
      console.error("Error checking biometric support:", err);
      setError("Failed to check biometric support");
    }
  };

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem(AUTH_KEY);
      if (authStatus === "true") {
        // Already authenticated, trigger biometric check
        await handleBiometricAuth();
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);

      // Animate button
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access Enviroscan",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await AsyncStorage.setItem(AUTH_KEY, "true");
        onAuthenticated();
      } else {
        if (result.error === "user_cancel") {
          setError("Authentication cancelled");
        } else if (result.error === "lockout") {
          setError("Too many failed attempts. Please try again later.");
        } else {
          setError("Authentication failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Biometric auth error:", err);
      setError("Authentication error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSkip = async () => {
    // For development/testing - allow skip
    await AsyncStorage.setItem(AUTH_KEY, "true");
    onAuthenticated();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "20", colors.background]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <ThemedText type="title" style={styles.title}>
          Enviroscan
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Secure Mesh Networking
        </ThemedText>

        {/* Biometric Icon */}
        <View style={[styles.biometricIcon, { backgroundColor: colors.primary + "20" }]}>
          <IconSymbol
            name="person.fill"
            size={48}
            color={colors.primary}
          />
        </View>

        {/* Status Text */}
        {isSupported && biometricType && (
          <ThemedText style={[styles.statusText, { color: colors.textSecondary }]}>
            Use {biometricType} to unlock
          </ThemedText>
        )}

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
            <ThemedText style={[styles.errorText, { color: colors.error }]}>
              {error}
            </ThemedText>
          </View>
        )}

        {/* Authenticate Button */}
        {isSupported && !error && (
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable
              style={[styles.authButton, { backgroundColor: colors.primary }]}
              onPress={handleBiometricAuth}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <IconSymbol name="person.fill" size={20} color="#fff" />
                  <ThemedText style={styles.authButtonText}>
                    Authenticate
                  </ThemedText>
                </>
              )}
            </Pressable>
          </Animated.View>
        )}

        {/* Skip Button (for development) */}
        {__DEV__ && (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={[styles.skipText, { color: colors.textSecondary }]}>
              Skip (Dev Only)
            </ThemedText>
          </Pressable>
        )}

        {/* Help Text */}
        <ThemedText style={[styles.helpText, { color: colors.textSecondary }]}>
          Your data is protected with device biometric authentication
        </ThemedText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
  },
  biometricIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    marginTop: 24,
    padding: 12,
  },
  skipText: {
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 48,
    maxWidth: 280,
  },
});
