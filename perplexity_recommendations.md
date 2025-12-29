# Perplexity AI Recommendations for Expo SDK Version

**Date:** December 29, 2024

## Key Recommendation: Use Expo SDK 52

**The recommended Expo SDK version for stable production iOS builds on EAS as of late 2024/early 2025 is SDK 52**, which avoids the Folly coroutine issues in SDK 54 and major expo-modules-core problems in SDK 53 while remaining compatible with Xcode 16 and iOS 17.5 SDK on EAS infrastructure.

## SDK Version Analysis

### SDK 52 (RECOMMENDED)
- ✅ **Stable and fully compatible** with current EAS Build (Xcode 16, iOS 17.5 SDK)
- ✅ Users report successful iOS builds after minor Metro bundler fixes
- ✅ No widespread Folly or Swift API issues reported
- ✅ Works well with react-native-ble-plx for Bluetooth

### SDK 53 (UNSTABLE)
- ❌ expo-modules-core@2.5.0 errors: `'some View' has no member 'onGeometryChange'`
- ❌ iOS 17+ API mismatch issues
- ❌ React Compiler failures (can be disabled but not fully reliable)

### SDK 54 (NOT PRODUCTION-READY)
- ❌ Fails with `'folly/coro/Coroutine.h' not found`
- ❌ React Native 0.81's Folly library lacks Xcode 16 C++ coroutine support
- ❌ No confirmed fix timeline
- ⏳ Likely requires Folly upstream updates in React Native 0.82+ or Expo SDK 55 (expected Q1 2025)

## Folly Coroutine Fix Timeline

No specific date available; tied to Folly library updates for Xcode 16 coroutines. Monitor Expo's changelog and React Native GitHub—fixes often land 1-3 months post-Xcode release. **Avoid SDK 54 until confirmed via `expo doctor` or build logs.**

## Best Approach for iOS App with react-native-ble-plx

1. **Downgrade to SDK 52 immediately** for reliable EAS iOS builds
2. Update `package.json`: `"expo": "^52.0.0"`
3. Run `npx expo install --fix` to update all dependencies
4. Configure app.json for BLE:
   - Add `"plugins": ["expo-build-properties", { "ios": { "useFrameworks": "static" } }]`
   - Ensure BLE permissions in `ios.infoPlist`:
     - `NSBluetoothAlwaysUsageDescription`
     - `NSBluetoothPeripheralUsageDescription`
5. Test with `eas build --platform ios --profile preview`
6. Use GitHub Actions for CI as before

## Final Recommendation

**Downgrade to SDK 52 now**—it's the most reliable path for production iOS with BLE, avoiding all listed failures. SDK 54 fixes are uncertain and distant; waiting risks delays. After stabilizing, plan upgrade to SDK 55 once announced (expected Q1 2025).

Run: `pnpm install expo@^52.0.0 --save-exact && pnpm expo install --fix`
