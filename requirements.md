# MeshCore Mobile - Requirements Specification

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Author:** Manus AI

---

## 1. Executive Summary

MeshCore Mobile (branded as **Enviroscan**) is a React Native mobile application built with Expo SDK 54 that serves as a companion interface for MeshCore mesh networking devices. The application enables users to communicate with mesh network nodes via Bluetooth Low Energy (BLE) or WebSocket connections to a MeshCore Bridge server, providing real-time messaging, node monitoring, telemetry visualization, and network management capabilities.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MeshCore Mobile App                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Messages  │  │    Nodes    │  │  Dashboard  │  │  Connect/Settings   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                │                     │            │
│  ┌──────┴────────────────┴────────────────┴─────────────────────┴──────────┐ │
│  │                        Service Layer                                     │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │ │
│  │  │   BLE Service   │  │ WebSocket Svc   │  │  MeshCore Protocol      │  │ │
│  │  └────────┬────────┘  └────────┬────────┘  └────────────┬────────────┘  │ │
│  └───────────┼────────────────────┼────────────────────────┼───────────────┘ │
└──────────────┼────────────────────┼────────────────────────┼─────────────────┘
               │                    │                        │
               ▼                    ▼                        │
┌──────────────────────┐  ┌─────────────────────────────────┐│
│  RAK4631/Heltec      │  │      MeshCore Bridge            ││
│  MeshCore Device     │  │  (Raspberry Pi + Django)        ││
│  (Direct BLE)        │  │                                 ││
└──────────────────────┘  │  ┌───────────┐  ┌────────────┐  ││
                          │  │   MQTT    │  │ PostgreSQL │  ││
                          │  │  Broker   │  │  Database  │  ││
                          │  └───────────┘  └────────────┘  ││
                          └─────────────────────────────────┘│
                                         │                   │
                                         ▼                   │
                          ┌─────────────────────────────────┐│
                          │     MeshCore Mesh Network       │◄┘
                          │  (RAK4631 nodes, sensors, etc.) │
                          └─────────────────────────────────┘
```

### 2.2 Connection Modes

The application supports two primary connection modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Direct BLE** | Connects directly to a MeshCore-compatible device via Bluetooth Low Energy | Field use without internet, direct device management |
| **WebSocket Bridge** | Connects to MeshCore Bridge server via WebSocket | Remote monitoring, multi-user access, persistent data storage |

---

## 3. MeshCore Bridge Integration

### 3.1 Overview

MeshCore Bridge is a companion server application that runs on a Raspberry Pi connected to a RAK4631 MeshCore device via USB/Serial. It provides:

- Binary packet parsing for MeshCore protocol
- MQTT publishing for IoT integration
- Django web interface for administration
- PostgreSQL database for message/node persistence
- WebSocket API for real-time mobile app connectivity

### 3.2 Communication Protocol

The mobile app communicates with MeshCore Bridge via WebSocket using JSON messages:

```typescript
interface WebSocketMessage {
  type: 'message' | 'node_update' | 'telemetry' | 'ping' | 'pong';
  data: {
    to?: string;           // Destination node hash
    text?: string;         // Message content
    channel?: number;      // Channel number (0-7)
    nodeId?: string;       // Node identifier
    timestamp: number;     // Unix timestamp
    [key: string]: any;    // Additional payload data
  };
}
```

### 3.3 Data Synchronization

| Data Type | Direction | Frequency |
|-----------|-----------|-----------|
| Node advertisements | Bridge → App | Real-time (on discovery) |
| Text messages | Bidirectional | Real-time |
| Telemetry data | Bridge → App | Periodic (configurable) |
| Position updates | Bidirectional | On change |
| Acknowledgments | Bidirectional | Per message |

---

## 4. Functional Requirements

### 4.1 Tab Navigation Structure

The application uses a bottom tab navigation with five primary screens:

| Tab | Screen | Primary Function |
|-----|--------|------------------|
| 1 | Messages (Home) | View conversations, send/receive messages |
| 2 | Nodes | Browse discovered mesh nodes |
| 3 | Map | Geographic visualization of node positions |
| 4 | Dashboard | Network health overview and quick actions |
| 5 | Connect | BLE/WebSocket connection management, settings |

### 4.2 Messages Screen (Home)

**Purpose:** Primary messaging interface for mesh network communication.

**Features:**
- Display list of conversations grouped by node
- Show unread message count per conversation
- Channel selector for filtering messages (Primary, Emergency, Data, etc.)
- Real-time message delivery status (sent, delivered, read)
- Floating action button for new message composition
- Pull-to-refresh for manual sync

**Data Model:**
```typescript
interface Message {
  id: string;
  sender: Node;
  recipient?: Node;
  content: string;
  messageType: 'txt_msg' | 'grp_txt' | 'grp_data';
  timestamp: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  channel: Channel;
}

interface Conversation {
  node: Node;
  lastMessage: Message;
  unreadCount: number;
}
```

### 4.3 Nodes Screen

**Purpose:** Display and manage discovered mesh network nodes.

**Features:**
- List all discovered nodes with status indicators
- Show node type (Chat, Repeater, Room Server, Sensor, Companion)
- Display real-time metrics (battery level, signal strength, last seen)
- Filter nodes by online/offline status
- Navigate to detailed node view on tap
- Pull-to-refresh for node discovery

**Data Model:**
```typescript
type NodeType = 'chat' | 'repeater' | 'room_server' | 'sensor' | 'companion';

interface Node {
  nodeHash: string;        // 4-byte hash identifier
  publicKey?: string;      // Ed25519 public key
  name: string;            // User-friendly name
  nodeType: NodeType;
  isOnline: boolean;
  lastSeen: Date;
  batteryLevel?: number;   // 0-100 percentage
  rssi?: number;           // Signal strength in dBm
  latitude?: number;
  longitude?: number;
  altitude?: number;
}
```

### 4.4 Map Screen

**Purpose:** Geographic visualization of mesh network topology.

**Features:**
- Display nodes on interactive map
- Color-coded markers by node type and status
- Show node names and basic info on marker tap
- Cluster nearby nodes at low zoom levels
- Center map on user location (with permission)
- Draw lines between connected nodes (future)

### 4.5 Dashboard Screen

**Purpose:** Network health overview and quick access to common actions.

**Features:**
- Network health score with visual indicator
- Statistics: online nodes, total messages, active channels
- Quick action buttons (Scan, Broadcast, Ping)
- Recent activity feed (last 5 messages)
- Node status summary (top 3 nodes with battery/signal)
- Navigation shortcuts to other screens

### 4.6 Connect Screen (Settings)

**Purpose:** Connection management and application settings.

**Features:**

**Connection Section:**
- BLE connection status indicator
- Scan for MeshCore devices button
- List of discovered BLE devices
- Connect/disconnect functionality
- WebSocket connection status
- Backend URL configuration

**Profile Section:**
- User display name configuration
- Node name for mesh network
- Avatar selection

**Preferences Section:**
- Dark/light theme toggle
- Notification settings
- Sound/haptic feedback toggles

**About Section:**
- App version information
- Privacy policy link
- Terms of service link
- Disclaimer text

---

## 5. Technical Requirements

### 5.1 BLE Service Specification

**Service UUID:** `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` (Nordic UART Service)

| Characteristic | UUID | Properties | Description |
|----------------|------|------------|-------------|
| TX | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` | Write | Send data to device |
| RX | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` | Notify | Receive data from device |

**Device Filtering:**
- Filter by name containing: "RAK", "Mesh", "Heltec"
- Request MTU of 512 bytes for larger packets

### 5.2 MeshCore Protocol Implementation

The app implements a subset of the MeshCore protocol for packet encoding/decoding:

**Packet Types:**
```typescript
enum PacketType {
  TEXT_MESSAGE = 0x02,
  ACK = 0x03,
  ADVERTISEMENT = 0x04,
  GROUP_TEXT = 0x05,
  GROUP_DATA = 0x06,
  POSITION = 0x08,
  TELEMETRY = 0x09,
  PING = 0x0A,
}
```

**Packet Structure:**
```
┌─────────┬──────────┬────────────────┬─────────┐
│ Header  │ Type     │ Payload Length │ Payload │
│ (1 byte)│ (1 byte) │ (2 bytes LE)   │ (var)   │
├─────────┴──────────┴────────────────┴─────────┤
│                    CRC16                       │
│                   (2 bytes)                    │
└────────────────────────────────────────────────┘
```

### 5.3 Data Persistence

**Local Storage (AsyncStorage):**
- User preferences
- Connection settings
- Cached node data
- Draft messages

**Server Storage (via MeshCore Bridge):**
- Message history
- Node database
- Telemetry records
- User accounts (optional)

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Requirement |
|--------|-------------|
| App launch time | < 3 seconds |
| Message send latency | < 500ms (to BLE/WebSocket) |
| Node list refresh | < 1 second |
| BLE scan duration | 10 seconds default |
| WebSocket reconnect | Exponential backoff, max 30s |

### 6.2 Compatibility

| Platform | Minimum Version |
|----------|-----------------|
| iOS | 13.0+ |
| Android | API 21 (5.0)+ |
| Expo SDK | 54 |
| React Native | 0.81.5 |
| Node.js (build) | 20.x |

### 6.3 Security

- BLE connections use device-level pairing
- WebSocket connections support TLS (wss://)
- No sensitive data stored in plain text
- Biometric authentication option for app access
- OAuth integration for user accounts (optional)

### 6.4 Accessibility

- Minimum touch target size: 44x44 points
- Support for system font scaling
- Dark/light mode support
- High contrast color ratios (WCAG AA)
- Screen reader compatibility (VoiceOver/TalkBack)

---

## 7. User Interface Design

### 7.1 Design System

**Color Palette:**
```typescript
const Colors = {
  primary: '#0066FF',      // Main accent color
  success: '#22C55E',      // Online status, success states
  warning: '#F59E0B',      // Low battery, warnings
  error: '#EF4444',        // Offline status, errors
  background: '#FFFFFF',   // Light mode background
  backgroundDark: '#0F172A', // Dark mode background
  surface: '#F1F5F9',      // Card backgrounds (light)
  surfaceDark: '#1E293B',  // Card backgrounds (dark)
  textPrimary: '#0F172A',  // Primary text
  textSecondary: '#64748B', // Secondary text
  textDisabled: '#94A3B8', // Disabled text
  border: '#E2E8F0',       // Borders and dividers
};
```

**Typography:**
```typescript
const Typography = {
  title: { fontSize: 28, fontWeight: 'bold', lineHeight: 34 },
  subtitle: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: 'normal', lineHeight: 18 },
};
```

**Spacing:**
```typescript
const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
```

**Border Radius:**
```typescript
const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
```

### 7.2 Component Library

The app uses custom themed components built on React Native primitives:

| Component | Purpose |
|-----------|---------|
| `ThemedText` | Text with automatic dark/light mode support |
| `ThemedView` | View with themed background |
| `IconSymbol` | Cross-platform icon component (SF Symbols/Material) |
| `ConnectionStatusBanner` | Global connection status indicator |
| `HapticTab` | Tab bar button with haptic feedback |

---

## 8. Project Structure

```
meshcore-mobile/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Messages (Home)
│   │   ├── nodes.tsx             # Nodes list
│   │   ├── map.tsx               # Map view
│   │   ├── dashboard.tsx         # Dashboard
│   │   └── connect.tsx           # Settings/Connect
│   ├── _layout.tsx               # Root layout
│   ├── chat.tsx                  # Individual chat screen
│   ├── node-detail.tsx           # Node detail screen
│   ├── modal.tsx                 # Modal screen
│   └── oauth/                    # OAuth callback handling
│       └── callback.tsx
├── components/                   # Reusable UI components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── connection-status-banner.tsx
│   ├── intro-screen.tsx
│   ├── biometric-login.tsx
│   └── ui/
│       ├── icon-symbol.tsx
│       └── collapsible.tsx
├── constants/                    # App constants
│   ├── theme.ts                  # Colors, fonts
│   ├── const.ts                  # App constants
│   ├── mock-data.ts              # Development mock data
│   └── oauth.ts                  # OAuth configuration
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts               # Authentication state
│   ├── use-bluetooth.ts          # BLE connection hook
│   ├── use-websocket.ts          # WebSocket connection hook
│   ├── use-biometric-auth.ts     # Biometric authentication
│   ├── use-color-scheme.ts       # Theme detection
│   └── use-theme-color.ts        # Theme color helper
├── lib/                          # Core services
│   ├── ble-service.ts            # BLE connection manager
│   ├── websocket-service.ts      # WebSocket client
│   ├── meshcore-protocol.ts      # Protocol encoder/decoder
│   ├── api-service.ts            # REST API client
│   ├── api.ts                    # API utilities
│   ├── auth.ts                   # Auth utilities
│   └── trpc.ts                   # tRPC client
├── server/                       # Backend server (optional)
│   ├── _core/                    # Core server modules
│   ├── routers.ts                # tRPC routers
│   ├── db.ts                     # Database connection
│   └── storage.ts                # File storage
├── drizzle/                      # Database schema
│   ├── schema.ts                 # Table definitions
│   └── relations.ts              # Table relations
├── plugins/                      # Expo config plugins
│   ├── withPodfileFix.js         # iOS Podfile fix
│   └── withFollyFix.js           # Folly library fix
├── assets/                       # Static assets
│   └── images/                   # App icons, splash
├── app.json                      # Expo configuration
├── app.config.ts                 # Dynamic Expo config
├── eas.json                      # EAS Build configuration
├── metro.config.js               # Metro bundler config
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 9. Build and Deployment

### 9.1 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

### 9.2 Production Build

```bash
# iOS build (requires macOS with Xcode)
eas build --platform ios --profile production --local

# Android build
eas build --platform android --profile production --local
```

### 9.3 EAS Build Profiles

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  }
}
```

---

## 10. Future Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| Offline message queue | High | Queue messages when disconnected |
| End-to-end encryption | High | Encrypt messages with node public keys |
| File/image sharing | Medium | Send multimedia via multipart packets |
| Group management | Medium | Create/manage mesh channels |
| Node firmware update | Low | OTA updates via BLE |
| AR node visualization | Low | Augmented reality node finder |

---

## 11. References

1. [MeshCore Protocol Specification](https://github.com/ripplebiz/MeshCore)
2. [RAK4631 Documentation](https://docs.rakwireless.com/Product-Categories/WisBlock/RAK4631/Overview/)
3. [Expo SDK 54 Documentation](https://docs.expo.dev/)
4. [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx)
5. [MeshCore Bridge Repository](https://github.com/willbullen/MeshCore-Bridge)
