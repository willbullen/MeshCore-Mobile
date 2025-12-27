# Enviroscan Mobile

A React Native mobile application for Enviroscan mesh networking devices, built with Expo SDK 54, TypeScript, and React 19.

![Enviroscan Mobile](assets/images/icon.png)

## Overview

Enviroscan Mobile is the companion mobile app for the Enviroscan mesh networking system. It enables users to communicate with RAK4631/Heltec/Meshtastic devices via Bluetooth Low Energy (BLE), view mesh network topology, send messages, and monitor node telemetry in real-time.

**Key Features:**

- 📱 **4-Tab Navigation**: Messages, Nodes, Map, Connect
- 🔵 **Bluetooth BLE**: Scan, connect, and communicate with mesh devices
- 🗺️ **Interactive Map**: Visualize node locations with color-coded status markers
- 💬 **Real-Time Messaging**: Send/receive text messages through mesh network
- 📊 **Node Monitoring**: View battery, signal strength, and telemetry data
- 🌐 **Backend Sync**: WebSocket integration with Django Enviroscan-Bridge API
- 🎨 **Modern UI**: Dark theme with smooth animations and haptic feedback
- 🔄 **Offline Queue**: Message queueing when devices are disconnected

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript 5.9 |
| Navigation | Expo Router 6 |
| Animations | react-native-reanimated 4.x |
| Maps | expo-maps |
| Bluetooth | react-native-ble-plx |
| State | React Hooks + Context |
| Backend | WebSocket + REST API (Django) |

## Project Structure

```
meshcore-mobile/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Messages tab
│   │   ├── nodes.tsx        # Nodes tab
│   │   ├── map.tsx          # Map tab
│   │   └── connect.tsx      # Connect/Settings tab
│   ├── chat.tsx             # Individual chat screen
│   ├── node-detail.tsx      # Node detail screen
│   └── _layout.tsx          # Root layout with intro screen
├── components/              # Reusable UI components
│   ├── themed-text.tsx      # Themed text component
│   ├── themed-view.tsx      # Themed view component
│   ├── intro-screen.tsx     # Animated intro screen
│   └── connection-status-banner.tsx  # BLE status banner
├── constants/               # App constants
│   ├── theme.ts            # Colors, fonts, spacing
│   └── mock-data.ts        # Mock data for development
├── hooks/                   # Custom React hooks
│   ├── use-bluetooth.ts    # Bluetooth BLE hook
│   ├── use-websocket.ts    # WebSocket backend hook
│   └── use-theme-color.ts  # Theme color hook
├── lib/                     # Core services
│   ├── ble-service.ts      # Bluetooth BLE service
│   ├── meshcore-protocol.ts # Enviroscan packet encoding/decoding
│   ├── websocket-service.ts # WebSocket backend service
│   └── api-service.ts      # REST API service
└── assets/                  # Images, icons, fonts
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Expo Go app on iOS/Android (for testing)
- Xcode (for iOS development build)
- Android Studio (for Android development build)

### Installation

```bash
# Clone the repository
git clone https://github.com/willbullen/Enviroscan-Mobile.git
cd Enviroscan-Mobile

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Running on Device

#### Option 1: Expo Go (Quick Testing)

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan the QR code from the terminal
3. **Note**: Bluetooth and Maps require a development build (see below)

#### Option 2: Development Build (Full Features)

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Django Backend URL
EXPO_PUBLIC_BACKEND_URL=https://your-meshcore-bridge.com

# Optional: API Keys
EXPO_PUBLIC_API_KEY=your_api_key_here
```

### App Branding

Update `app.config.ts` to customize app name and logo:

```typescript
const env = {
  appName: 'Enviroscan Mobile',
  appSlug: 'meshcore-mobile',
  logoUrl: 'https://your-s3-bucket.com/logo.png',
  // ...
};
```

## Features

### 1. Messages Tab

- View all conversations with mesh nodes
- Real-time message receiving via Bluetooth
- Send messages to individual nodes
- Channel selector for different mesh channels
- Message status indicators (queued/sent/delivered/failed)

### 2. Nodes Tab

- List all discovered mesh nodes
- Battery and signal strength indicators
- Online/offline status badges
- Node detail view with metrics:
  - Battery level
  - Signal strength (RSSI/SNR)
  - Last seen timestamp
  - GPS coordinates
  - Firmware version

### 3. Map Tab

- Interactive map with node markers
- Color-coded status (green = online, gray = offline)
- Tap markers to view node info
- Center on current location
- Legend for marker colors

### 4. Connect Tab

- Bluetooth device scanning
- Connect/disconnect from mesh devices
- BLE state monitoring
- User profile settings
- App preferences
- About section with version info

## Architecture

### Bluetooth BLE Flow

```
User Taps "Scan" → BLEService.startScan()
                 ↓
         Filter RAK/Mesh devices
                 ↓
         Display in device list
                 ↓
User Taps "Connect" → BLEService.connect(deviceId)
                 ↓
         Subscribe to characteristic
                 ↓
         Listen for mesh packets
                 ↓
         EnviroscanProtocol.decode()
                 ↓
         Update UI (messages/nodes/map)
```

### Backend Sync Flow

```
App Launch → WebSocketService.connect()
           ↓
    Authenticate with token
           ↓
    Subscribe to message events
           ↓
    Receive real-time updates
           ↓
    Sync with local state
```

### Enviroscan Protocol

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

## Development

### Mock Data

The app includes comprehensive mock data for development without physical hardware:

- 5 mock nodes with realistic data
- 20 mock messages across conversations
- 3 mesh channels (LongFast, MediumSlow, ShortFast)

Mock data is located in `constants/mock-data.ts`.

### Testing with Real Hardware

1. **Build development version**:
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
pnpm start --clear

# Type check
pnpm tsc --noEmit

# Reset project
pnpm reset-project
```

## Backend Integration

### Django Enviroscan-Bridge API

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

## Deployment

### Build for Production

```bash
# iOS (requires Apple Developer account)
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

### App Store Submission

1. Update version in `app.config.ts`
2. Build production version with EAS
3. Submit to App Store Connect / Google Play Console
4. Wait for review (1-7 days)

## Troubleshooting

### Bluetooth Not Working

- **Expo Go**: Bluetooth requires a development build
- **iOS**: Check `Info.plist` has Bluetooth permissions
- **Android**: Enable location services (required for BLE scanning)

### Map Not Showing

- **Expo Go**: Maps require a development build
- **iOS**: Check API keys in `app.config.ts`
- **Android**: Enable Google Maps API in Google Cloud Console

### WebSocket Connection Failed

- Check `EXPO_PUBLIC_BACKEND_URL` in `.env`
- Verify Django backend is running
- Check CORS settings in Django
- Ensure WebSocket endpoint is accessible

### App Crashes on Launch

- Clear cache: `pnpm start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check logs: `pnpm dev` and look for errors

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Meshtastic](https://meshtastic.org/) - Mesh networking protocol inspiration
- [RAK Wireless](https://www.rakwireless.com/) - Hardware platform
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx) - Bluetooth library

## Support

For issues and questions:

- GitHub Issues: https://github.com/willbullen/Enviroscan-Mobile/issues
- Email: support@meshcore.io
- Discord: https://discord.gg/meshcore

## Roadmap

- [ ] End-to-end encryption for messages
- [ ] Voice message recording
- [ ] Image sharing
- [ ] Push notifications
- [ ] Offline message queue
- [ ] Multi-device sync
- [ ] Group channels
- [ ] Message reactions
- [ ] Location sharing
- [ ] Dark/light theme toggle

---

**Built with ❤️ for the mesh networking community**
