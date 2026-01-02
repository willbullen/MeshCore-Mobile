# iOS App Store Submission Guide

This guide walks you through submitting Enviroscan to the Apple App Store.

## Prerequisites

### Required Accounts and Tools
- Apple Developer Account ($99/year)
- App Store Connect access
- Xcode or EAS CLI
- Screenshots and metadata prepared

## Step 1: App Store Connect Setup

### 1.1 Create App

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in app information:
   - **Platform**: iOS
   - **Name**: Enviroscan
   - **Primary Language**: English (US)
   - **Bundle ID**: com.willbullen.enviroscan
   - **SKU**: enviroscan-ios (unique identifier)
   - **User Access**: Full Access

### 1.2 App Information

Navigate to your app → App Information:

**Category**:
- Primary: Utilities
- Secondary: Social Networking

**Age Rating**:
- 4+ (No objectionable content)

**Privacy Policy URL**:
- https://your-domain.com/privacy

**Support URL**:
- https://your-domain.com/support

**Marketing URL** (optional):
- https://your-domain.com

## Step 2: Version Information

### 2.1 Basic Information

Navigate to "1.0 Prepare for Submission":

**Name**: Enviroscan

**Subtitle** (30 characters):
Mesh Network Communication

**Privacy**: Select privacy choices based on your data collection

### 2.2 Description

**Promotional Text** (170 characters):
```
Connect and communicate through decentralized mesh networks. Perfect for outdoor adventures, emergency preparedness, and off-grid communication.
```

**Description** (4000 characters):
```
Enviroscan is a powerful mesh networking companion app that enables real-time communication with RAK4631/Heltec mesh devices via Bluetooth Low Energy (BLE). Stay connected even when traditional networks are unavailable.

KEY FEATURES:

📱 Real-Time Messaging
• Send and receive text messages through the mesh network
• View conversation history with individual nodes
• Message status indicators (sent/delivered/failed)
• Offline message queue with automatic retry

🗺️ Interactive Map
• Visualize node locations on an interactive map
• Color-coded status markers (online/offline)
• GPS coordinates for each node
• Tap markers for detailed information

📊 Network Dashboard
• Real-time network health monitoring
• View online nodes and total network statistics
• Average battery level across all nodes
• Recent activity feed

🔵 Node Management
• Discover and connect to mesh devices via Bluetooth
• View detailed node information and telemetry
• Battery level and signal strength indicators
• Node type identification (chat/repeater/sensor)

🔄 Offline Support
• Queue messages when disconnected
• Automatic retry with exponential backoff
• Local message and node storage
• Sync with backend server when available

🔐 Security
• Optional biometric authentication (Face ID/Touch ID)
• Secure local storage
• End-to-end encryption support

PERFECT FOR:
• Outdoor adventures and hiking
• Emergency preparedness
• Off-grid communication
• IoT sensor monitoring
• Community mesh networks
• Ham radio enthusiasts

HARDWARE COMPATIBILITY:
• RAK4631 WisBlock Core
• Heltec WiFi LoRa 32
• Other MeshCore-compatible devices

REQUIREMENTS:
• Bluetooth Low Energy (BLE) support
• iOS 13.0 or later
• Compatible mesh network device (sold separately)

NOTE: This app is a companion interface for mesh networking hardware. Physical mesh network devices are required for communication. Visit our website for compatible hardware information.

Privacy focused: All data is stored locally on your device. Backend integration is optional and controlled by you.
```

**Keywords** (100 characters):
```
mesh,network,lora,ble,bluetooth,ham radio,offline,IoT,sensor,telemetry,emergency,hiking
```

**What's New in This Version**:
```
Initial release of Enviroscan mesh networking app:
• Real-time messaging through mesh networks
• Interactive map visualization
• Network health monitoring
• BLE device connectivity
• Offline message queue
• Node management and telemetry
```

## Step 3: Screenshots

### Required Sizes

Create screenshots for:
- **6.5" Display** (iPhone 14 Pro Max): 1284 x 2778 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels  
- **12.9" Display** (iPad Pro): 2048 x 2732 pixels

### Screenshot Recommendations

1. **Dashboard Screen** - Show network overview and health metrics
2. **Messages Screen** - Display conversation list
3. **Chat Screen** - Show individual chat with messages
4. **Nodes Screen** - List of discovered nodes with metrics
5. **Map Screen** - Interactive map with node markers

### Tips
- Use actual app screenshots (not mockups)
- Show app in use with realistic data
- Ensure status bar shows 9:41 AM (Apple convention)
- Use light mode for better visibility
- Avoid including sensitive user data

## Step 4: App Review Information

**Contact Information**:
- First Name: [Your Name]
- Last Name: [Your Last Name]
- Phone: [Your Phone]
- Email: [Your Email]

**Review Notes**:
```
This app requires physical mesh networking hardware to function fully. For review purposes:

1. The app can be tested in "demo mode" without hardware - mock data is available for UI testing
2. For BLE functionality testing, compatible hardware:
   - RAK4631 WisBlock Core
   - Heltec WiFi LoRa 32 V3
3. The app uses Bluetooth Low Energy for local communication with mesh devices
4. Backend server integration is optional

Test Account (if backend used):
Username: reviewer@test.com
Password: [Provide test credentials]

Please note: BLE functionality requires a development build and will not work in Expo Go.
```

## Step 5: Build Upload

### Option A: Using EAS CLI

```bash
# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest
```

### Option B: Using Xcode

```bash
# Generate iOS project
npx expo prebuild --platform ios --clean

# Open in Xcode
cd ios
open Enviroscan.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as target
# 2. Product → Archive
# 3. Window → Organizer
# 4. Select archive → "Distribute App"
# 5. App Store Connect → Upload
```

## Step 6: TestFlight Beta Testing

### 6.1 Internal Testing

1. Go to App Store Connect → TestFlight
2. Click on your build (processing takes 5-30 minutes)
3. Add internal testers (up to 100)
4. Internal testers receive email invite
5. No review required for internal testing

### 6.2 External Testing

1. Create external group (e.g., "Beta Testers")
2. Add up to 10,000 external testers
3. Requires App Review (first time only)
4. Add "What to Test" notes for beta testers

## Step 7: Submit for Review

1. Complete all required fields in App Store Connect
2. Select build version
3. Answer Export Compliance questions:
   - Does your app use encryption? Yes (HTTPS)
   - Is it exempt? Yes (standard encryption)
4. Click "Submit for Review"

## Step 8: Review Process

### Timeline
- **Initial Review**: 24-48 hours typically
- **Updates**: Usually faster (12-24 hours)

### Common Rejection Reasons

1. **Missing functionality**: Ensure app works without hardware
2. **Privacy**: Must include privacy policy
3. **Screenshots**: Must match actual app
4. **Description**: Must accurately describe app features
5. **Test account**: Provide working credentials if needed

### If Rejected

1. Read rejection reason carefully
2. Address all issues mentioned
3. Reply in Resolution Center
4. Resubmit when ready

## Step 9: Release

### Automatic Release
- App releases automatically after approval
- Based on settings in "Version Release"

### Manual Release
1. Select "Manually release this version"
2. After approval, click "Release This Version"

### Phased Release
- Gradual rollout to users over 7 days
- Can pause or stop if issues found

## Step 10: Post-Release

### Monitor

1. **Crash Reports**: Check Xcode Organizer
2. **Reviews**: Respond to user reviews
3. **Analytics**: Monitor downloads and engagement
4. **TestFlight**: Continue beta testing for updates

### Updates

```bash
# 1. Increment version
npm version patch  # or minor/major

# 2. Update "What's New"
# Edit in App Store Connect

# 3. Build and submit
eas build --platform ios --profile production
eas submit --platform ios --latest

# 4. Submit for review
# In App Store Connect
```

## Checklist

- [ ] Apple Developer Account active
- [ ] App created in App Store Connect
- [ ] Bundle ID configured
- [ ] App information filled
- [ ] Screenshots prepared (all sizes)
- [ ] Description written
- [ ] Keywords added
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Age rating completed
- [ ] App icon uploaded (1024x1024)
- [ ] Build uploaded to App Store Connect
- [ ] Build selected for version
- [ ] TestFlight tested
- [ ] Export compliance answered
- [ ] Submitted for review
- [ ] Monitoring enabled

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
