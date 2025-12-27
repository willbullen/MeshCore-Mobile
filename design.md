# MeshCore Mobile App - Interface Design

## Design Philosophy

MeshCore mobile app is a companion to the MeshCore-Bridge system, providing mesh networking capabilities on iOS and Android devices. The design follows Apple Human Interface Guidelines with a dark, technical aesthetic matching the web application's black and dark blue theme.

## Visual Style

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

## Screen Designs

### 1. Messages Tab (Home)

**Primary Screen: Conversations List**
- Header with "Messages" title and channel selector button
- List of conversation cards showing:
  - Avatar (node icon or first letter)
  - Node name
  - Last message preview (truncated)
  - Timestamp
  - Unread badge (if applicable)
  - Online status indicator (green dot)
- Empty state: "No conversations yet" with icon
- Floating action button for new message

**Secondary Screen: Chat View**
- Header with node name, back button, and info button
- Message bubbles:
  - Sent messages: Right-aligned, blue background
  - Received messages: Left-aligned, dark surface background
  - Timestamp below each message
  - Status indicator (sent/delivered/failed)
- Input bar at bottom:
  - Text input field
  - Send button (blue, disabled when empty)
- Auto-scroll to latest message

**Modal: Channel Selector**
- List of available channels
- Radio buttons for selection
- Primary channel highlighted
- Close button

### 2. Nodes Tab

**Primary Screen: Node List**
- Header with "Nodes" title and filter button
- Grid or list of node cards showing:
  - Node icon (based on type)
  - Node name
  - Node type badge
  - Online/offline status
  - Battery level (if available)
  - Signal strength (RSSI/SNR)
  - Last seen timestamp
- Pull to refresh
- Empty state: "No nodes discovered"

**Secondary Screen: Node Detail**
- Header with node name and back button
- Hero section:
  - Large node icon
  - Node type
  - Online status
- Metrics section:
  - Battery level with icon
  - Signal strength (RSSI/SNR)
  - Last seen time
  - Distance (if location available)
- Location section:
  - Small map preview
  - Coordinates
  - "View on Map" button
- Actions section:
  - "Send Message" button
  - "Request Position" button
  - "View Telemetry" button

### 3. Map Tab

**Primary Screen: Map View**
- Full-screen map (MapLibre or React Native Maps)
- Custom markers for each node:
  - Color-coded by status (green=online, gray=offline)
  - Icon based on node type
  - Pulse animation for online nodes
- Info window on marker tap:
  - Node name
  - Status
  - Battery level
  - "View Details" button
- Controls:
  - Center on user location button (bottom right)
  - Zoom controls
  - Layer selector (satellite/terrain)
- Legend at bottom showing marker colors

### 4. Connect Tab

**Primary Screen: Connection & Settings**

**Connection Status Card:**
- Large status indicator (connected/disconnected)
- Connected device name (if connected)
- Connection type (Bluetooth/HTTP)
- Signal strength
- "Connect" or "Disconnect" button

**Bluetooth Devices Section:**
- "Scan for Devices" button
- List of discovered devices:
  - Device name
  - MAC address
  - Signal strength
  - "Connect" button

**Settings Section:**
- User profile:
  - Avatar placeholder
  - Node name input
  - Node type selector
- Preferences:
  - Notifications toggle
  - Sound toggle
  - Keep screen on toggle
- About:
  - App version
  - GitHub link
  - Documentation link

## User Flows

### Primary Flow: Send a Message

1. User opens app → Messages tab (default)
2. User taps conversation or "New Message" FAB
3. User types message in input field
4. User taps send button
5. Message appears in chat with "sending" status
6. Status updates to "delivered" when confirmed

### Secondary Flow: View Node on Map

1. User navigates to Nodes tab
2. User taps a node card
3. Node detail screen opens
4. User taps "View on Map" button
5. App switches to Map tab
6. Map centers on node location
7. Node marker is highlighted

### Tertiary Flow: Connect to Device

1. User navigates to Connect tab
2. User taps "Scan for Devices"
3. List populates with nearby devices
4. User taps "Connect" on desired device
5. Connection status updates to "Connecting..."
6. Status changes to "Connected" when successful
7. Device name appears in status card

## Navigation Structure

**Bottom Tab Bar (Always Visible):**
- Messages (house.fill icon) - Default tab
- Nodes (antenna.radiowaves.left.and.right icon)
- Map (map.fill icon)
- Connect (dot.radiowaves.left.and.right icon)

**Tab Bar Styling:**
- Background: `#1a1a2e` (dark surface)
- Active icon: `#3b82f6` (bright blue)
- Inactive icon: `#64748b` (muted gray)
- Height: 49pt + safe area inset

## Interaction Patterns

### Gestures
- Swipe right: Go back (iOS standard)
- Pull down: Refresh (on lists)
- Long press: Context menu (on nodes/messages)
- Pinch: Zoom (on map)

### Animations
- Tab switch: Smooth fade transition
- List items: Fade in on load
- Buttons: Scale down on press (0.95)
- Status changes: Color transition (300ms)
- Modal: Slide up from bottom

### Feedback
- Light haptic on tab switch
- Medium haptic on button press
- Success haptic on message sent
- Error haptic on connection failure

## Accessibility

- All touch targets minimum 44pt
- High contrast text (white on dark)
- Clear focus indicators
- VoiceOver labels on all interactive elements
- Dynamic type support for text scaling

## Performance Considerations

- Lazy load message history (paginated)
- Virtualized lists for nodes (FlatList)
- Debounced search/filter inputs
- Cached map tiles
- Optimized re-renders with React.memo

## Mock Data Requirements

**5 Nodes:**
1. Base Station (repeater, online, 100% battery, home location)
2. Mobile Node 1 (chat, online, 75% battery, nearby)
3. Mobile Node 2 (chat, offline, 45% battery, distant)
4. Sensor Node (sensor, online, 90% battery, fixed location)
5. Companion Node (companion, online, 60% battery, moving)

**20 Messages:**
- Mix of sent and received
- Various timestamps (recent to 2 days ago)
- Different channels (primary, secondary)
- Different statuses (delivered, sent, failed)

**3 Channels:**
1. Primary (LongFast, role: primary)
2. Secondary (MediumSlow, role: secondary)
3. Admin (ShortSlow, role: disabled)

## Technical Constraints

- Portrait orientation only (mobile-first)
- iOS 13+ and Android 8+ support
- Offline-first architecture (local storage)
- No backend connectivity in prototype
- Mock Bluetooth scanning (no real BLE)

## Success Criteria

- All 4 tabs functional with mock data
- Smooth 60fps animations
- No broken navigation or dead ends
- Consistent visual design across screens
- Professional polish (loading states, empty states, error states)
- Matches web app's design language
- Ready for user testing and feedback
