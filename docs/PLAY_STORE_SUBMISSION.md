# Google Play Store Submission Guide

This guide walks you through submitting Enviroscan to the Google Play Store.

## Prerequisites

### Required Accounts and Tools
- Google Play Console account ($25 one-time)
- Google Account
- EAS CLI or Android Studio
- Screenshots and metadata prepared

## Step 1: Google Play Console Setup

### 1.1 Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete identity verification
4. Accept Developer Distribution Agreement

### 1.2 Create App

1. Click "Create app"
2. Fill in details:
   - **App name**: Enviroscan
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations
4. Click "Create app"

## Step 2: Set Up App

### 2.1 App Access

Navigate to App content → App access:

- **All functionality available without special access**: Yes
- Or provide test credentials if backend login required

### 2.2 Ads

Navigate to App content → Ads:

- **Does your app contain ads?**: No

### 2.3 Content Rating

Navigate to App content → Content rating:

1. Start questionnaire
2. Select category: **Utility, Productivity, Communication, or Other**
3. Answer questions (all "No" for basic app)
4. Submit for rating
5. Expected rating: **Everyone** or **Everyone 10+**

### 2.4 Target Audience

Navigate to App content → Target audience:

- **Age groups**: 18 and over (or 13 and over with parental consent)

### 2.5 News App

Navigate to App content → News app:

- **Is your app a news app?**: No

### 2.6 COVID-19 Contact Tracing and Status Apps

- **Is your app a COVID-19 contact tracing or status app?**: No

### 2.7 Data Safety

Navigate to App content → Data safety:

Fill in data collection and security practices:

**Data Collection**:
- Location: Collected (for BLE functionality, not shared)
- Device ID: Collected (for node identification, not shared)

**Data Sharing**:
- No data shared with third parties

**Data Security**:
- Data encrypted in transit (HTTPS)
- Data encrypted at rest (device storage)
- Users can request data deletion
- No data collection without user consent

## Step 3: Store Listing

### 3.1 Main Store Listing

Navigate to Main store listing:

**App name**: Enviroscan

**Short description** (80 characters):
```
Mesh network communication app for RAK4631/Heltec devices
```

**Full description** (4000 characters):
```
Enviroscan is a powerful mesh networking companion app that enables real-time communication with RAK4631/Heltec mesh devices via Bluetooth Low Energy (BLE). Stay connected even when traditional networks are unavailable.

KEY FEATURES

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
• Optional biometric authentication (fingerprint)
• Secure local storage
• End-to-end encryption support

PERFECT FOR
• Outdoor adventures and hiking
• Emergency preparedness
• Off-grid communication
• IoT sensor monitoring
• Community mesh networks
• Ham radio enthusiasts

HARDWARE COMPATIBILITY
• RAK4631 WisBlock Core
• Heltec WiFi LoRa 32
• Other MeshCore-compatible devices

REQUIREMENTS
• Bluetooth Low Energy (BLE) support
• Android 5.0 (API 21) or later
• Location permission (required for BLE scanning)
• Compatible mesh network device (sold separately)

NOTE
This app is a companion interface for mesh networking hardware. Physical mesh network devices are required for communication.

PRIVACY
Privacy focused: All data is stored locally on your device. Backend integration is optional and controlled by you.

Visit our website for compatible hardware information and documentation.
```

### 3.2 Graphics

**App icon** (512 x 512 PNG):
- Upload app icon without transparency
- Must match icon in APK

**Feature graphic** (1024 x 500 JPG or PNG):
- Create banner showcasing app features
- No text (Android adds app name)

**Phone screenshots** (Required):
- Minimum 2, maximum 8
- JPEG or 24-bit PNG
- Minimum side: 320px, maximum side: 3840px
- Max dimension cannot be more than 2x min dimension
- Recommended: 1080 x 1920 (portrait) or 1920 x 1080 (landscape)

Screenshots to include:
1. Dashboard with network overview
2. Messages list
3. Individual chat screen
4. Nodes list with metrics
5. Map view with markers

**Tablet screenshots** (Optional):
- Same requirements as phone
- Recommended: 1200 x 1920 or 1920 x 1200

### 3.3 Categorization

**App category**: Productivity

**Tags** (up to 5):
- Mesh networking
- Bluetooth
- IoT
- Off-grid
- Communication

**Email**: your-email@domain.com

**Phone**: +1-XXX-XXX-XXXX (optional)

**Website**: https://your-domain.com

**Privacy Policy**: https://your-domain.com/privacy (required)

## Step 4: Release

### 4.1 Select Release Track

Navigate to Production → Create new release:

- **Production**: Public release
- **Open testing**: Public beta (no approval needed)
- **Closed testing**: Private beta (up to 100 testers)
- **Internal testing**: Internal only (up to 100)

### 4.2 Upload App Bundle

#### Option A: Using EAS CLI

```bash
# Build for production
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --latest
```

#### Option B: Manual Upload

```bash
# Build AAB
eas build --platform android --profile production

# Download AAB from EAS
# Upload to Play Console manually
```

### 4.3 Release Name

**Release name**: 1.0.0

### 4.4 Release Notes

**What's new in this release**:
```
Initial release of Enviroscan:
• Real-time messaging through mesh networks
• Interactive map visualization with node markers
• Network health monitoring and analytics
• BLE device connectivity and management
• Offline message queue with auto-retry
• Node telemetry and metrics display
• Dark mode support
```

### 4.5 Countries

**Countries and regions**: Select all (or specific countries)

## Step 5: Review and Publish

1. Review all information
2. Click "Save"
3. Click "Review release"
4. Click "Start rollout to Production"

## Step 6: Review Process

### Timeline
- **Initial Review**: 1-7 days (usually 1-3 days)
- **Updates**: Usually faster (1-2 days)

### Common Rejection Reasons

1. **Privacy Policy**: Must be accessible and complete
2. **Permissions**: Must justify all permissions requested
3. **Functionality**: App must work as described
4. **Content Rating**: Must be accurate
5. **Data Safety**: Must disclose all data collection

### If Rejected

1. Read rejection email carefully
2. Address all issues in Policy Status
3. Make necessary changes
4. Resubmit release

## Step 7: Post-Release

### Monitor

1. **Statistics**: Downloads, ratings, crashes
2. **Reviews**: Respond to user reviews
3. **Pre-launch reports**: Automated testing results
4. **Android vitals**: Performance metrics

### Updates

```bash
# 1. Increment version
npm version patch  # or minor/major

# 2. Update build number in app.json
# Increment "android.versionCode"

# 3. Build and submit
eas build --platform android --profile production
eas submit --platform android --latest

# 4. Add release notes in Play Console
# 5. Roll out update
```

## Step 8: Advanced Features

### 8.1 In-App Updates

Consider implementing in-app updates:

```gradle
dependencies {
    implementation 'com.google.android.play:app-update:2.1.0'
}
```

### 8.2 Staged Rollout

- Start with 5% of users
- Monitor for crashes/issues
- Gradually increase to 100%

### 8.3 Pre-Registration

- Launch pre-registration campaign
- Build audience before release
- Notify users when app is available

## Checklist

- [ ] Google Play Console account created
- [ ] App created in console
- [ ] App name set
- [ ] Short description written
- [ ] Full description written
- [ ] App icon uploaded (512x512)
- [ ] Feature graphic uploaded (1024x500)
- [ ] Screenshots uploaded (minimum 2)
- [ ] Category selected
- [ ] Privacy policy URL added
- [ ] Contact information added
- [ ] App access completed
- [ ] Ads declaration completed
- [ ] Content rating received
- [ ] Target audience selected
- [ ] Data safety completed
- [ ] AAB uploaded
- [ ] Release notes added
- [ ] Countries selected
- [ ] Submitted for review
- [ ] Monitoring enabled

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Android App Publishing Guide](https://developer.android.com/studio/publish)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Material Design Guidelines](https://material.io/design)
- [Android Vitals](https://developer.android.com/topic/performance/vitals)
