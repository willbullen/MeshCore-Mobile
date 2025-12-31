# Development Build Guide

This guide explains how to create a development build to test BLE (Bluetooth Low Energy) and Maps functionality, which are not available in Expo Go.

## Why Development Builds?

Expo Go has limitations:
- ❌ **BLE (react-native-ble-plx)**: Native module not included in Expo Go
- ❌ **Maps (react-native-maps)**: Native module not included in Expo Go
- ✅ **Development Builds**: Include all native modules and allow full testing

## Prerequisites

1. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```

2. **EAS Account** (free tier available):
   ```bash
   eas login
   ```

3. **Apple Developer Account** (for iOS builds):
   - Required for device testing
   - Free account works for development builds

4. **Android Studio** (for local Android builds - optional):
   - Or use EAS cloud builds (recommended)

## Building a Development Build

### Option 1: Cloud Build (Recommended)

#### iOS Development Build

```bash
# Build for iOS simulator
eas build --profile development --platform ios

# Build for iOS device
eas build --profile development --platform ios --device
```

#### Android Development Build

```bash
# Build for Android
eas build --profile development --platform android
```

### Option 2: Local Build

#### iOS (macOS only)

```bash
# Install dependencies
npx expo prebuild

# Build for simulator
npx expo run:ios

# Build for device
npx expo run:ios --device
```

#### Android

```bash
# Install dependencies
npx expo prebuild

# Build and run
npx expo run:android
```

## Installing the Development Build

### iOS

1. **Simulator**: The build will automatically install when using `expo run:ios`
2. **Device**: 
   - Download the `.ipa` from EAS build page
   - Install via TestFlight or direct install
   - Or use `eas build --profile development --platform ios --device` and scan QR code

### Android

1. **Emulator**: The build will automatically install when using `expo run:android`
2. **Device**:
   - Download the `.apk` from EAS build page
   - Enable "Install from Unknown Sources" on your device
   - Install the APK file
   - Or use `eas build --profile development --platform android` and scan QR code

## Running the Development Server

After installing the development build:

1. **Start Metro bundler**:
   ```bash
   npx expo start --dev-client
   ```

2. **Connect to the app**:
   - Open the development build app on your device/simulator
   - Scan the QR code or press `i` for iOS / `a` for Android

## Testing BLE Functionality

Once you have a development build installed:

1. **Enable Bluetooth** on your device
2. **Grant permissions** when prompted
3. **Navigate to Connect tab** in the app
4. **Start scanning** for BLE devices
5. **Connect to a MeshCore device** (RAK4631, Heltec, etc.)

### Expected Behavior

- ✅ BLE scanning should work
- ✅ Device discovery should show nearby MeshCore devices
- ✅ Connection to devices should succeed
- ✅ Data transmission should work

### Troubleshooting BLE

- **"Bluetooth is not powered on"**: Enable Bluetooth in device settings
- **"Permissions not granted"**: Grant Bluetooth and Location permissions
- **"No devices found"**: Ensure MeshCore device is powered on and advertising
- **Connection fails**: Check device is in range and not connected to another app

## Testing Maps Functionality

Maps should work in development builds:

1. **Navigate to Map tab**
2. **View node markers** on the map
3. **Tap markers** to see node details
4. **Tap "Tap to open in Maps"** to open in native Maps app

### Expected Behavior

- ✅ Map should load and display
- ✅ Node markers should appear at correct locations
- ✅ Markers should show online/offline status
- ✅ Tapping markers should show node info
- ✅ Opening in Maps app should work

### Troubleshooting Maps

- **Map not loading**: Check internet connection (required for map tiles)
- **Markers not showing**: Verify nodes have latitude/longitude data
- **iOS Maps not working**: Ensure location permissions are granted
- **Android Maps not working**: Add Google Maps API key to `app.json` if needed

## Google Maps API Key (Android - Optional)

For better map performance on Android, you can add a Google Maps API key:

1. **Get API key** from [Google Cloud Console](https://console.cloud.google.com/)
2. **After running `npx expo prebuild`**, add the API key to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application>
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_API_KEY_HERE" />
   </application>
   ```
3. **Rebuild** the development build

**Note**: `react-native-maps` doesn't have an Expo config plugin, so it will auto-link when you create a development build. No plugin configuration is needed in `app.json`.

## Development Workflow

1. **Make code changes** in your editor
2. **Save files** - Metro will hot reload
3. **Test BLE/Maps** in the development build
4. **Iterate** as needed

## Building for Production

When ready for production:

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Development Builds Guide](https://docs.expo.dev/development/introduction/)
- [react-native-ble-plx Docs](https://github.com/dotintent/react-native-ble-plx)
- [react-native-maps Docs](https://github.com/react-native-maps/react-native-maps)

## Quick Start Commands

```bash
# Login to EAS
eas login

# Build iOS development build
eas build --profile development --platform ios

# Build Android development build
eas build --profile development --platform android

# Start development server
npx expo start --dev-client
```
