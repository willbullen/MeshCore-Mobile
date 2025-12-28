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

## New Bug Fix
- [x] Fix NativeEventEmitter error in BLE service initialization

## Intro Screen Feature
- [x] Create animated intro screen component with logo
- [x] Add fade-in and scale animations with Reanimated
- [x] Implement first-launch detection with AsyncStorage
- [x] Add intro screen to app layout
- [x] Test animations and transitions

## Critical BLE Error Fix
- [x] Prevent BleManager instantiation entirely in Expo Go to avoid NativeEventEmitter error

## Backend Integration
- [x] Create WebSocket service for real-time communication
- [x] Connect to Django backend WebSocket endpoint
- [x] Implement message sync (send/receive)
- [x] Add node telemetry sync
- [x] Handle WebSocket reconnection
- [x] Create useWebSocket React hook
- [ ] Fix infinite loop issue in WebSocket hook
- [ ] Update Messages tab to use backend sync
- [ ] Update Nodes tab to fetch from backend

## WebSocket Hook Fix
- [x] Debug infinite loop in useWebSocket hook
- [x] Use useRef for stable callback references
- [x] Test hook works without causing re-renders
- [ ] Re-integrate into chat screen

## Documentation
- [x] Create comprehensive README with setup instructions
- [x] Document architecture and data flow
- [x] Add troubleshooting section
- [x] Include deployment instructions

## GitHub
- [x] Commit all changes
- [x] Push to GitHub repository

## Dashboard Feature
- [x] Create new dashboard tab as first screen
- [x] Add network overview card (connected nodes, health status)
- [x] Add metrics widgets (total nodes, messages today, battery avg)
- [x] Add recent activity feed (last 5 messages/events)
- [x] Add quick action buttons (Send Message, Scan Devices, View Map)
- [x] Update tab navigation to include Dashboard
- [x] Add icon mapping for dashboard tab

## Biometric Login Feature
- [x] Install expo-local-authentication package
- [x] Create login screen with biometric prompt
- [x] Add Face ID/Touch ID support for iOS
- [x] Add fingerprint/face unlock support for Android
- [x] Implement authentication state management
- [x] Store authentication status in AsyncStorage
- [x] Add logout functionality
- [x] Integrate login screen into app layout
- [x] Add fallback PIN/password option

## Bug Fix: Login Screen Still Shows Old Branding
- [x] Investigate why login screen shows old MeshCore icon
- [x] Check if icon.png was properly updated
- [x] Verify biometric-login.tsx text changes were applied
- [x] Clear Metro bundler cache if needed
- [x] Restart dev server to reload assets
- [ ] Test login screen shows new Enviroscan branding

## Update Login Screen Subtitle
- [x] Change subtitle from 'Secure Mesh Networking' to 'Monitoring Network'
- [x] Update biometric-login.tsx
- [x] Fix title to show Enviroscan instead of MeshCore
- [ ] Test changes in Expo Go

## Update Intro Screen Subtitle for Brand Consistency
- [x] Change intro screen subtitle from 'Decentralized Mesh Network' to 'Monitoring Network'
- [x] Update intro-screen.tsx
- [x] Fix title to show Enviroscan instead of MeshCore

## Create Static app.json for Expo Launch
- [x] Generate app.json from app.config.ts
- [x] Keep app.config.ts for development flexibility
- [x] Fix remaining branding issues in app.config.ts
- [ ] Test that both files work together

## Fix Expo Launch Configuration
- [x] Add EAS project ID to app.json
- [x] Update slug to 'enviroscan' (from 'meshcore-mobile')
- [x] Update iOS bundle identifier to 'com.willbullen.enviroscan'
- [x] Update Android package to 'com.willbullen.enviroscan'
- [x] Rename app.config.ts to .backup to avoid conflicts with Expo Launch
- [ ] Test Expo Launch build process

## Legal Documentation for App Store
- [x] Create privacy policy document
- [x] Create terms of service document
- [x] Add disclaimer to About section in Connect tab
- [x] Add Privacy Policy and Terms links to About section
- [x] Update contact email to admin@enviroscan.io
- [x] Update app.json with privacy settings
- [ ] Host legal documents on GitHub (already in repo)
- [ ] Add open source license attributions (optional)

## Fix Expo Launch iOS Build Error
- [x] Investigate archive failure during iOS build
- [x] Create eas.json configuration file
- [x] Configure production build settings
- [ ] Test build with Expo Launch again
- [ ] Check build logs for specific errors if build fails

## Replace expo-maps with Native Map Solution
- [x] Find all uses of expo-maps in codebase
- [x] Replace with react-native-maps (simpler, no API key required for basic use)
- [x] Update package.json to remove expo-maps
- [x] Install react-native-maps package
- [x] Fix TypeScript errors
- [x] Restart dev server
- [ ] Test map functionality in Expo Go
- [ ] Retry iOS build with Expo Launch

## Fix App Not Running
- [x] Check dev server status and error logs
- [x] Identify issue with react-native-maps (web import error)
- [x] Fix configuration with Platform check to exclude web
- [x] Restart dev server and verify app loads

## Fix HTTP 500 Error
- [x] Check dev server logs for crash details
- [x] Identify root cause (react-native-maps Metro bundler issue)
- [x] Remove react-native-maps completely
- [x] Revert map.tsx to simple fallback UI
- [x] Restart server and verify app loads

## Fix iOS Archive Build Failure
- [x] Analyze Xcode build error logs
- [x] Identify missing react-native-ble-plx config plugin
- [x] Disable newArchEnabled for compatibility
- [x] Add react-native-ble-plx to plugins array
- [ ] Test build with Expo Launch

## Fix Reanimated New Architecture Requirement
- [x] Re-enable newArchEnabled (Reanimated 4.x requires it)
- [ ] Test build again

## Fix Reanimated RCT_NEW_ARCH_ENABLED Environment Variable
- [x] Add RCT_NEW_ARCH_ENABLED=1 to eas.json build environment
- [ ] Test build again

## Downgrade Reanimated to 3.x for Expo Launch Compatibility
- [x] Downgrade react-native-reanimated from 4.x to 3.x
- [x] Remove react-native-worklets dependency (only needed for 4.x)
- [x] Disable newArchEnabled in app.json
- [x] Fix useScrollOffset -> useScrollViewOffset API change
- [ ] Test app still works
- [ ] Test Expo Launch build

## Remove Push Notifications to Fix iOS Build
- [x] Remove expo-notifications from package.json
- [x] Remove POST_NOTIFICATIONS permission from app.json
- [ ] Test build with Expo Launch

## Fix Folly Coroutine Header Error
- [x] Create withFollyFix config plugin to disable Folly coroutines
- [x] Add plugin to app.json
- [ ] Test build with Expo Launch

## Fix Folly with expo-build-properties
- [ ] Install expo-build-properties
- [ ] Add extraPods configuration to disable Folly coroutines
- [ ] Test build

## iOS Build via GitHub Actions (Alternative to Expo Launch)
- [ ] Create .github/workflows directory
- [ ] Create iOS build workflow file with Xcode 15.4
- [ ] Configure Apple certificates and provisioning profiles as GitHub secrets
- [ ] Test GitHub Actions build and troubleshoot any issues
- [ ] Submit successful build to App Store Connect
