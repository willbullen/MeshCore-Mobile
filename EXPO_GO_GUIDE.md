# Using Expo Go

Expo Go is a mobile app that lets you run your Expo project on your phone without building a native app. It's great for quick development and testing, but has some limitations.

## Installing Expo Go

### iOS
1. Download **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Open the app on your iPhone or iPad

### Android
1. Download **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Open the app on your Android device

## Starting Your Project

1. **Start the Metro bundler**:
   ```bash
   npx expo start
   ```
   
   Or with the clear flag if you have cache issues:
   ```bash
   npx expo start --clear
   ```

2. **You'll see a QR code** in your terminal and a menu with options:
   ```
   › Metro waiting on exp://192.168.x.x:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   
   › Press a │ open Android
   › Press i │ open iOS simulator
   › Press w │ open web
   ```

## Connecting Your Device

### iOS (iPhone/iPad)

**Option 1: Camera App (Easiest)**
1. Open the **Camera app** on your iPhone
2. Point it at the QR code in your terminal
3. Tap the notification that appears
4. Expo Go will open and load your app

**Option 2: Expo Go App**
1. Open **Expo Go** app
2. Tap **"Scan QR Code"**
3. Scan the QR code from your terminal
4. Your app will load

### Android

1. Open the **Expo Go** app on your Android device
2. Tap **"Scan QR code"**
3. Scan the QR code from your terminal
4. Your app will load

## Troubleshooting

### "Unable to connect to Metro bundler"

**Make sure your phone and computer are on the same Wi-Fi network**

If they're on different networks:
1. Press `s` in the terminal to switch to tunnel mode
2. Scan the QR code again

### "Network response timed out"

1. Check your firewall settings
2. Try tunnel mode: Press `s` in the terminal
3. Restart Metro: `npx expo start --clear`

### QR Code Not Scanning

1. Make sure the terminal window is large enough to show the full QR code
2. Try typing `?` in the terminal to see all options
3. Use the URL directly: Copy the `exp://` URL and paste it in Expo Go's "Enter URL manually" option

## What Works in Expo Go

✅ **Most Expo SDK features work:**
- Navigation (Expo Router)
- UI components
- AsyncStorage
- Secure Store
- Haptics
- Images
- Fonts
- WebSocket connections
- HTTP requests
- Theme switching (dark/light mode)

## What Doesn't Work in Expo Go

❌ **Native modules not included in Expo Go:**
- **Bluetooth (BLE)** - `react-native-ble-plx` requires a development build
- **Maps** - `react-native-maps` requires a development build
- Other custom native modules

## Development Workflow

1. **Make changes** to your code
2. **Save the file** - Metro will automatically reload
3. **See changes instantly** in Expo Go (hot reload)

### Manual Reload

- **Shake your device** (or press `Cmd+D` on iOS simulator / `Cmd+M` on Android emulator)
- Select **"Reload"** from the developer menu

### Developer Menu

- **iOS**: Shake device or press `Cmd+Ctrl+Z` in simulator
- **Android**: Shake device or press `Cmd+M` in emulator

Options available:
- Reload
- Debug Remote JS
- Show Element Inspector
- Show Performance Monitor

## Quick Commands

```bash
# Start Expo (standard)
npx expo start

# Start with cleared cache
npx expo start --clear

# Start in tunnel mode (for different networks)
npx expo start --tunnel

# Start for specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Keyboard Shortcuts (in Metro terminal)

- `a` - Open on Android device/emulator
- `i` - Open on iOS simulator
- `w` - Open in web browser
- `r` - Reload app
- `m` - Toggle menu
- `s` - Switch between LAN and tunnel mode
- `?` - Show all commands

## For Your MeshCore App

### What You Can Test in Expo Go:
- ✅ Navigation between tabs
- ✅ Messages/chat UI
- ✅ Node list UI
- ✅ Dashboard UI
- ✅ Connection status UI
- ✅ Theme switching
- ✅ WebSocket connections (if connecting to MeshCore Bridge)

### What Requires Development Build:
- ❌ BLE scanning and connections
- ❌ Interactive maps (MapView will show loading state)

**Note**: Your app will show warnings like `[BLE] BleManager not available` in Expo Go - this is expected. The UI will still work, but BLE features won't function until you create a development build.

## Next Steps

If you need to test BLE or Maps functionality, see [DEVELOPMENT_BUILD.md](./DEVELOPMENT_BUILD.md) for instructions on creating a development build.

## Tips

1. **Keep Expo Go updated** - Update the app regularly for best compatibility
2. **Use tunnel mode** if you're on different networks
3. **Clear cache** if you see strange behavior: `npx expo start --clear`
4. **Check Expo Go version** - Make sure it matches your Expo SDK version (SDK 54)

## Getting Help

- [Expo Go Documentation](https://docs.expo.dev/get-started/expo-go/)
- [Expo Forums](https://forums.expo.dev/)
- [Expo Discord](https://chat.expo.dev/)
