# MeshCore Mobile App - TODO

## Phase 1: Foundation & Branding
- [x] Update app.config.ts with MeshCore branding
- [x] Update constants/theme.ts with MeshCore color scheme
- [x] Create mock data file with nodes, messages, and channels
- [x] Add icon mappings for all 4 tabs

## Phase 2: Navigation Setup
- [x] Update tab layout with 4 tabs (Messages, Nodes, Map, Connect)
- [x] Configure tab bar styling with MeshCore theme
- [x] Add proper icon mappings for all tabs
- [x] Set Messages as default tab

## Phase 3: Messages Tab
- [x] Create conversations list screen
- [x] Add conversation cards with avatars and previews
- [x] Create chat screen with message bubbles
- [x] Add message input with send button
- [ ] Implement channel selector modal
- [x] Add message status indicators
- [x] Add empty state for no conversations

## Phase 4: Nodes Tab
- [x] Create nodes list screen
- [x] Add node cards with status badges
- [x] Show battery and signal indicators
- [x] Create node detail screen
- [x] Add metrics section (battery, signal, last seen)
- [x] Add location section with coordinates
- [x] Add action buttons (message, request position)
- [x] Add pull to refresh
- [x] Add empty state for no nodes

## Phase 5: Map Tab
- [x] Install and configure react-native-maps
- [x] Create map view screen
- [x] Add custom node markers
- [x] Color-code markers by status (green/gray)
- [x] Add marker info windows
- [x] Add center on location button
- [x] Add zoom controls
- [x] Add legend for marker colors

## Phase 6: Connect Tab
- [x] Create connection status card
- [x] Add connect/disconnect button
- [x] Create Bluetooth devices section
- [x] Add scan for devices button
- [x] Add device list with mock data
- [x] Create settings section
- [x] Add user profile inputs
- [x] Add preferences toggles
- [x] Add about section with version and links

## Phase 7: Polish & Animations
- [x] Add smooth tab transitions
- [x] Add button press animations (scale down)
- [x] Add list item fade-in animations
- [x] Add loading states for all screens
- [x] Add empty states for all lists
- [x] Add error states for failed actions
- [x] Add haptic feedback for interactions
- [x] Optimize performance with React.memo

## Phase 8: Branding Assets
- [x] Generate custom MeshCore app icon
- [x] Copy icon to all required locations
- [x] Update app.config.ts with logo URL
- [x] Verify splash screen configuration

## Phase 9: Testing & Delivery
- [x] Test all navigation flows
- [x] Test on iOS via Expo Go
- [x] Test on Android via Expo Go
- [x] Verify all buttons are functional
- [x] Verify no dead ends or broken links
- [x] Take screenshots for documentation
- [x] Create checkpoint with final version

## Bug Fixes
- [x] Fix react-native-maps error by switching to expo-maps
- [x] Update map.tsx to use Expo Maps API
- [x] Test map functionality on device

## Phase 10: Bluetooth Integration
- [x] Install react-native-ble-plx package
- [x] Add Bluetooth permissions to app.config.ts
- [x] Create BLE service for device scanning
- [x] Implement device connection management
- [x] Add BLE state management (connected/disconnected)
- [x] Create packet send/receive handlers
- [x] Update Connect tab with real BLE functionality
- [x] Add connection status indicators across app
- [x] Integrate Bluetooth with Messages tab for real messaging

## Phase 11: MeshCore Protocol
- [x] Create protocol constants and types
- [x] Implement packet encoder (text, position, telemetry)
- [x] Implement packet decoder
- [x] Add CRC/checksum validation
- [ ] Create message queue for reliable delivery
- [x] Add packet acknowledgment system
- [ ] Implement retry logic for failed packets

## Phase 12: Backend Integration
- [x] Create API service with axios
- [ ] Implement WebSocket connection to Django
- [x] Add authentication token management
- [x] Create REST endpoints for nodes
- [x] Create REST endpoints for messages
- [x] Create REST endpoints for telemetry
- [ ] Implement real-time message sync
- [ ] Add connection status monitoring

## Phase 13: Enhanced Messaging
- [ ] Install expo-notifications for push notifications
- [ ] Configure notification permissions
- [ ] Add notification handler for new messages
- [ ] Implement offline message queue with AsyncStorage
- [ ] Add message delivery status tracking
- [ ] Create message retry mechanism
- [ ] Add typing indicators
- [ ] Implement read receipts

## Phase 14: Multimedia Support
- [ ] Install expo-image-picker for image selection
- [ ] Add image compression with expo-image-manipulator
- [ ] Implement image upload to backend
- [ ] Add image preview in chat
- [ ] Install expo-av for audio recording
- [ ] Create voice message recorder UI
- [ ] Implement audio playback controls
- [ ] Add waveform visualization

## Phase 15: UI/UX Polish
- [ ] Add loading skeleton components
- [ ] Implement pull-to-refresh animations
- [ ] Add message send animations
- [ ] Create connection status banner
- [ ] Add haptic feedback throughout
- [ ] Implement swipe gestures for actions
- [ ] Add dark mode splash screen
- [ ] Create onboarding flow

## Phase 16: Testing & Deployment
- [ ] Test Bluetooth on physical RAK4631
- [ ] Test backend connectivity
- [ ] Test offline functionality
- [ ] Test push notifications
- [ ] Test image/voice sharing
- [ ] Build production APK
- [ ] Build production IPA
- [ ] Create app store assets
- [ ] Write deployment documentation

## Repository Setup
- [x] Create GitHub repository MeshCore-Mobile
- [x] Push initial code to GitHub
- [x] Configure repository settings

## Critical Bug Fixes
- [x] Fix BLEManager native module error - make BLE optional
- [x] Fix ExpoMaps native module error - add fallback UI
- [x] Update useBluetooth hook to handle missing BLE gracefully
- [x] Update Connect tab to show "requires dev build" message
- [x] Update Map tab to show fallback when maps unavailable
- [x] Test app runs without errors in Expo Go
