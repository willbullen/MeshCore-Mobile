# Enviroscan Mobile

A React Native mobile application for mesh networking devices, built with Expo SDK 54, TypeScript, and React 18. Enables communication with RAK4631/Heltec/Meshtastic devices via Bluetooth Low Energy (BLE), view mesh network topology, send messages, and monitor node telemetry in real-time.

![Enviroscan Mobile](assets/images/icon.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Local Preview](#local-preview)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Design System](#design-system)
- [Backend Integration](#backend-integration)
- [Troubleshooting](#troubleshooting)
- [Legal](#legal)
- [Contributing](#contributing)
- [Support](#support)

## Overview

Enviroscan Mobile is the companion mobile app for the MeshCore mesh networking system. It provides a modern, intuitive interface for managing mesh network devices, monitoring environmental sensors, and communicating through decentralized mesh networks.

**Key Capabilities:**
- 📱 **4-Tab Navigation**: Dashboard, Messages, Nodes, Map, Connect
- 🔵 **Bluetooth BLE**: Scan, connect, and communicate with mesh devices
- 🗺️ **Interactive Map**: Visualize node locations with color-coded status markers
- 💬 **Real-Time Messaging**: Send/receive text messages through mesh network
- 📊 **Node Monitoring**: View battery, signal strength, and telemetry data
- 🌐 **Backend Sync**: WebSocket integration with Django MeshCore-Bridge API
- 🎨 **Modern UI**: Dark theme with smooth animations and haptic feedback
- 🔄 **Offline Queue**: Message queueing when devices are disconnected
- 🔐 **Biometric Security**: Face ID/Touch ID authentication

## Features

### Dashboard Tab
- Network overview with connected nodes count
- Health status indicators
- Metrics widgets (total nodes, messages today, average battery)
- Recent activity feed
- Quick action buttons

### Messages Tab
- View all conversations with mesh nodes
- Real-time message receiving via Bluetooth
- Send messages to individual nodes
- Channel selector for different mesh channels
- Message status indicators (queued/sent/delivered/failed)
- Individual chat screens with message history

### Nodes Tab
- List all discovered mesh nodes
- Battery and signal strength indicators
- Online/offline status badges
- Node detail view with metrics:
  - Battery level
  - Signal strength (RSSI/SNR)
  - Last seen timestamp
  - GPS coordinates
  - Firmware version
- Pull to refresh

### Map Tab
- Interactive map with node markers
- Color-coded status (green = online, gray = offline)
- Tap markers to view node info
- Center on current location
- Legend for marker colors

### Connect Tab
- Bluetooth device scanning
- Connect/disconnect from mesh devices
- BLE state monitoring
- User profile settings
- App preferences
- About section with version info

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.76 + Expo SDK 54 |
| Language | TypeScript 5.3 |
| Navigation | Expo Router 4 |
| Animations | react-native-reanimated 3.x |
| Bluetooth | react-native-ble-plx |
| State | React Hooks + Context |
| Backend | WebSocket + REST API (Django) |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- **Node.js** 20.19.4+ (required for Expo SDK 54)
- **pnpm** (package manager)
- **Expo CLI** (installed via pnpm)
- **iOS**: macOS with Xcode (for iOS development)
- **Android**: Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/willbullen/MeshCore-Mobile.git
cd MeshCore-Mobile

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Django Backend URL (optional)
EXPO_PUBLIC_BACKEND_URL=https://your-meshcore-bridge.com

# OAuth Configuration (if using backend)
EXPO_PUBLIC_OAUTH_PORTAL_URL=https://portal.manuscdn.com
EXPO_PUBLIC_OAUTH_SERVER_URL=https://server.manuscdn.com
EXPO_PUBLIC_APP_ID=your_app_id
EXPO_PUBLIC_OWNER_OPEN_ID=your_owner_id
EXPO_PUBLIC_OWNER_NAME=Your Name
EXPO_PUBLIC_API_BASE_URL=https://your-api.com
```

## Local Preview

### Option 1: Web Browser (Fastest - Limited Features)

Preview the app in your web browser. Some native features (Bluetooth, Maps) won't work.

```bash
pnpm dev:metro
```

Opens automatically at `http://localhost:8081`.

**Limitations:**
- ❌ Bluetooth (react-native-ble-plx) - requires development build
- ❌ Maps - requires development build
- ✅ UI/Navigation - Full support
- ✅ Animations - Full support

### Option 2: Expo Go on Physical Device (Quick Testing)

Use the Expo Go app on your phone for quick testing.

1. **Install Expo Go** on your phone:
   - iOS: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Connect your device:**
   - **iOS:** Scan the QR code with Camera app (iOS 11+)
   - **Android:** Scan the QR code with Expo Go app
   - **Or:** Press `i` for iOS simulator, `a` for Android emulator

**Limitations:**
- ❌ Bluetooth - requires development build
- ❌ Maps - requires development build
- ✅ Basic features work

### Option 3: iOS Simulator (macOS Only - Full Features)

```bash
npx expo start --ios
```

The iOS Simulator will open automatically. Full features including Bluetooth and Maps work.

### Option 4: Android Emulator (Full Features)

1. Start Android Emulator from Android Studio
2. Run:
   ```bash
   npx expo start --android
   ```

### Option 5: Development Build on Physical Device (Full Features)

#### iOS (macOS Required):
```bash
pnpm expo prebuild --platform ios
npx expo run:ios --device
```

**Requirements:**
- macOS with Xcode
- iOS device connected via USB
- Apple Developer account (free tier works)

#### Android:
```bash
pnpm expo prebuild --platform android
npx expo run:android --device
```

**Requirements:**
- Android device connected via USB with USB debugging enabled
- Android SDK installed

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both server and Metro bundler (full stack) |
| `pnpm dev:metro` | Start only Metro bundler (includes web) |
| `pnpm dev:server` | Start only the backend server |
| `pnpm ios` | Start Expo with iOS simulator |
| `pnpm android` | Start Expo with Android emulator |
| `npx expo start` | Start Expo development server (interactive) |
| `pnpm check` | Type check with TypeScript |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests with Vitest |

## Project Structure

```
MeshCore-Mobile/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Messages tab
│   │   ├── dashboard.tsx    # Dashboard tab
│   │   ├── nodes.tsx        # Nodes tab
│   │   ├── map.tsx          # Map tab
│   │   └── connect.tsx      # Connect/Settings tab
│   ├── chat.tsx             # Individual chat screen
│   ├── node-detail.tsx      # Node detail screen
│   ├── oauth/               # OAuth callback handler
│   └── _layout.tsx          # Root layout with intro screen
├── components/              # Reusable UI components
│   ├── themed-text.tsx      # Themed text component
│   ├── themed-view.tsx      # Themed view component
│   ├── intro-screen.tsx     # Animated intro screen
│   ├── biometric-login.tsx  # Biometric authentication
│   └── connection-status-banner.tsx  # BLE status banner
├── constants/               # App constants
│   ├── theme.ts            # Colors, fonts, spacing
│   ├── mock-data.ts        # Mock data for development
│   ├── const.ts            # Shared constants
│   └── oauth.ts            # OAuth configuration
├── hooks/                   # Custom React hooks
│   ├── use-bluetooth.ts    # Bluetooth BLE hook
│   ├── use-websocket.ts    # WebSocket backend hook
│   ├── use-auth.ts         # Authentication hook
│   └── use-theme-color.ts  # Theme color hook
├── lib/                     # Core services
│   ├── ble-service.ts      # Bluetooth BLE service
│   ├── meshcore-protocol.ts # MeshCore packet encoding/decoding
│   ├── websocket-service.ts # WebSocket backend service
│   └── api-service.ts      # REST API service
├── server/                  # Backend server (optional)
│   ├── _core/              # Core server modules
│   ├── routers.ts          # tRPC routers
│   └── db.ts               # Database configuration
├── shared/                  # Shared types and utilities
├── assets/                  # Images, icons, fonts
└── docs/                    # Documentation
    ├── PRIVACY_POLICY.md
    └── TERMS_OF_SERVICE.md
```

## Configuration

### App Branding

Update `app.json` to customize app name and configuration:

```json
{
  "expo": {
    "name": "Enviroscan",
    "slug": "enviroscan",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.willbullen.enviroscan"
    },
    "android": {
      "package": "com.willbullen.enviroscan"
    }
  }
}
```

### Build Configuration

The `eas.json` file contains build profiles:

- **development**: Development client with debugging
- **preview**: Internal distribution build
- **production**: App Store/Play Store build

## Development

### Mock Data

The app includes comprehensive mock data for development without physical hardware:

- 5 mock nodes with realistic data
- 20 mock messages across conversations
- 3 mesh channels (LongFast, MediumSlow, ShortFast)

Mock data is located in `constants/mock-data.ts`.

### Testing with Real Hardware

1. **Build development version:**
   ```bash
   npx expo run:ios  # or run:android
   ```

2. **Enable Bluetooth** on your device

3. **Power on RAK4631** or compatible mesh device

4. **Open Connect tab** → Tap "Scan for Devices"

5. **Connect** to your device

6. **Send a message** from Messages tab

### Debugging

```bash
# View logs
pnpm dev

# Clear cache
npx expo start --clear

# Type check
pnpm check

# Lint code
pnpm lint
```

## Building for Production

### MacinCloud iOS Build Instructions

#### Prerequisites
- MacinCloud Mac Mini M1 with macOS Ventura 13.7.8 (Xcode 15.2)
- Node.js 20.19.4+, pnpm, and eas-cli installed
- Repository cloned at `~/MeshCore-Mobile`
- Apple Developer account credentials ready

#### Step 1: Pull Latest Code

```bash
cd ~/MeshCore-Mobile
git pull origin main
```

#### Step 2: Clean and Reinstall Dependencies

```bash
# Remove old node_modules, iOS folder, and any npm artifacts
rm -rf node_modules ios .expo
rm -f package-lock.json  # Remove if exists (we use pnpm)

# Install dependencies
pnpm store prune
pnpm install
```

**Verification:**
- Only `pnpm-lock.yaml` should exist (not `package-lock.json`)
- Only `metro.config.js` should exist (not `metro.config.cjs`)

#### Step 3: Run Expo Prebuild

```bash
# Regenerate iOS folder with fixed configuration
pnpm expo prebuild --platform ios --clean
```

**Expected output:**
- ✅ iOS folder created successfully
- ✅ No TypeScript module errors
- ✅ CocoaPods installed successfully

#### Step 4: Build with EAS (Local Build)

**Option A: Local Build with Project Configuration**
```bash
eas build --platform ios --profile production --local
```

**Option B: Local Build Skipping Project Configuration (if code signing issues)**
```bash
eas build --platform ios --profile production --local --skip-project-configuration
```

**What this does:**
- Builds the iOS app on the MacinCloud machine (not EAS servers)
- Uses the production profile from eas.json
- Generates a .ipa file for App Store submission

#### Step 5: Submit to App Store

If the build completes successfully, submit the .ipa file:

```bash
eas submit --platform ios --path <path-to-ipa>
```

Or manually upload via Xcode:
1. Open Xcode
2. Window → Organizer
3. Select the archive
4. Click "Distribute App"
5. Follow the App Store submission wizard

#### Alternative: Direct Xcode Build

If EAS local build fails, you can build directly with Xcode:

1. Open the project:
   ```bash
   cd ~/MeshCore-Mobile/ios
   open Enviroscan.xcworkspace
   ```

2. In Xcode:
   - Select "Any iOS Device (arm64)" as the build target
   - Product → Archive
   - Wait for archive to complete
   - Window → Organizer → Distribute App

#### Build Profiles (eas.json)

The production profile is configured with:
- iOS simulator: false
- Distribution: store
- Build image: macos-sonoma-14.5-xcode-15.4
- Node.js: 20.18.0

#### Expected Build Time

- Prebuild: 2-5 minutes
- EAS local build: 15-30 minutes
- Xcode archive: 10-20 minutes

### Android Build

```bash
# Build Android APK
eas build --platform android --profile production

# Or build locally
pnpm expo prebuild --platform android
npx expo run:android --variant release
```

## Design System

### Color Palette

**Primary Colors:**
- Background: `#0a0a0a` (True black)
- Surface: `#1a1a2e` (Dark blue-black)
- Primary: `#3b82f6` (Bright blue)
- Secondary: `#1e40af` (Deep blue)
- Accent: `#60a5fa` (Light blue)

**Text Colors:**
- Primary text: `#ffffff` (White)
- Secondary text: `#94a3b8` (Muted gray)
- Disabled text: `#64748b` (Darker gray)

**Status Colors:**
- Success: `#22c55e` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Info: `#3b82f6` (Blue)

### Typography

- **Title**: 32px, bold, white
- **Subtitle**: 20px, bold, white
- **Body**: 16px, regular, white
- **Caption**: 12px, regular, muted gray
- **Line Height**: 1.4× font size minimum

### Spacing & Layout

- **Grid**: 8pt base unit
- **Padding**: 16px screen edges, 12px card internal
- **Gaps**: 8px between items, 16px between sections
- **Border Radius**: 8px buttons, 12px cards, 16px modals

### Components

- **Cards**: Dark blue surface (#1a1a2e), 12px radius, subtle shadow
- **Buttons**: 8px radius, 44pt minimum touch target
- **Icons**: 24pt in tab bar, 20pt in buttons, filled style
- **Badges**: Small circles for status indicators

## Backend Integration

### Django MeshCore-Bridge API

The app connects to the Django backend via:

1. **WebSocket** (`wss://backend.com/ws/mesh/`)
   - Real-time message sync
   - Node status updates
   - Telemetry streaming

2. **REST API** (`https://backend.com/api/`)
   - `GET /nodes/` - Fetch all nodes
   - `POST /messages/` - Send message
   - `GET /telemetry/` - Fetch telemetry data
   - `POST /auth/token/` - Authentication

### Authentication

The app uses token-based authentication:

```typescript
// Login
const { token } = await apiService.login(email, password);

// All subsequent requests include token
headers: { Authorization: `Bearer ${token}` }
```

### MeshCore Protocol

The app uses a custom binary protocol for mesh packets:

```typescript
interface MeshPacket {
  id: string;
  from: string;  // Node hash
  to: string;    // Destination hash
  type: PacketType;  // TEXT_MESSAGE | POSITION | TELEMETRY | ACK
  payload: any;
  timestamp: number;
  channel: number;
  hopLimit: number;
}
```

**Packet Types:**
- `TEXT_MESSAGE`: Chat messages
- `POSITION`: GPS coordinates
- `TELEMETRY`: Battery, signal, temperature
- `ACK`: Message acknowledgment

### Backend Server (Optional)

The project includes an optional backend server in the `server/` directory. This provides:

- **tRPC API**: Type-safe API endpoints
- **Database**: Drizzle ORM with MySQL/PostgreSQL
- **Authentication**: Manus OAuth integration
- **File Storage**: S3 integration
- **AI Features**: LLM integration for AI-powered features

See `server/README.md` for detailed backend documentation.

## Troubleshooting

### Bluetooth Not Working

- **Expo Go**: Bluetooth requires a development build
- **iOS**: Check `Info.plist` has Bluetooth permissions:
  - `NSBluetoothAlwaysUsageDescription`
  - `NSBluetoothPeripheralUsageDescription`
- **Android**: Enable location services (required for BLE scanning)

### Map Not Showing

- **Expo Go**: Maps require a development build
- **iOS**: Check API keys in `app.json`
- **Android**: Enable Google Maps API in Google Cloud Console

### WebSocket Connection Failed

- Check `EXPO_PUBLIC_BACKEND_URL` in `.env`
- Verify Django backend is running
- Check CORS settings in Django
- Ensure WebSocket endpoint is accessible

### App Crashes on Launch

- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check logs: `pnpm dev` and look for errors

### Metro Bundler Module Resolution Errors

Verify `metro.config.js` exists and has pnpm support:

```bash
# Check metro.config.js exists
ls -la metro.config.js

# Verify it contains unstable_enableSymlinks
grep 'unstable_enableSymlinks' metro.config.js
# Should show: unstable_enableSymlinks: true,
```

### Code Signing Errors (iOS)

Use `--skip-project-configuration` flag:
```bash
eas build --platform ios --profile production --local --skip-project-configuration
```

Or configure signing manually in Xcode.

### Prebuild Fails

Clear all caches and retry:
```bash
rm -rf node_modules ios .expo
rm -f package-lock.json
pnpm store prune
pnpm install
pnpm expo prebuild --platform ios --clean
```

### Expo Go Can't Connect

- Ensure phone and computer are on the same Wi-Fi network
- Try using tunnel mode: `npx expo start --tunnel`
- Check firewall isn't blocking port 8081

## Legal

### Privacy Policy

See [docs/PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md) for complete privacy policy.

**Summary:**
- Data is stored locally on your device
- Bluetooth data is used only for mesh network communication
- Location data is required by iOS for Bluetooth functionality
- No data is shared with third parties without your explicit configuration
- Backend integration is optional and controlled by you

### Terms of Service

See [docs/TERMS_OF_SERVICE.md](docs/TERMS_OF_SERVICE.md) for complete terms of service.

**Important Disclaimers:**
- **NOT FOR SAFETY-CRITICAL USE**: Do not use for medical, safety, or life-support applications
- **Data Accuracy**: Depends on sensor hardware quality and configuration
- **No Warranties**: App provided "as is" without warranties
- **Hardware Disclaimer**: We do not manufacture or support hardware devices

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Run `pnpm lint` and `pnpm format` before committing
- Write tests for new features

## Support

For issues and questions:

- **GitHub Issues**: https://github.com/willbullen/MeshCore-Mobile/issues
- **Email**: admin@enviroscan.io
- **Repository**: https://github.com/willbullen/MeshCore-Mobile

## Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Meshtastic](https://meshtastic.org/) - Mesh networking protocol inspiration
- [RAK Wireless](https://www.rakwireless.com/) - Hardware platform
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx) - Bluetooth library

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the mesh networking community**
