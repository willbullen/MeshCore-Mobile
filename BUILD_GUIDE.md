# Build and Deployment Guide

This guide covers the complete build and deployment process for MeshCore Mobile.

## Prerequisites

### Required Accounts
- **Expo Account**: Sign up at https://expo.dev
- **Apple Developer Account**: $99/year for iOS builds
- **Google Play Console Account**: $25 one-time for Android builds
- **GitHub Account**: For CI/CD automation

### Required Tools
- **Node.js**: v20.19.4 or higher
- **pnpm**: Package manager
- **EAS CLI**: `npm install -g eas-cli`
- **Expo CLI**: `npm install -g expo-cli`

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure EAS

```bash
# Login to Expo
eas login

# Configure EAS project
eas init
```

### 3. Configure App Credentials

#### iOS Code Signing
```bash
# Generate iOS credentials
eas credentials

# Or use existing credentials
# Add to your secrets:
# - EXPO_APPLE_ID
# - EXPO_APPLE_APP_SPECIFIC_PASSWORD
```

#### Android Keystore
```bash
# Generate Android keystore
eas credentials

# Or use existing keystore
# Add to your secrets:
# - EXPO_ANDROID_KEYSTORE_ALIAS
# - EXPO_ANDROID_KEYSTORE_PASSWORD
# - EXPO_ANDROID_KEY_PASSWORD
```

## Local Builds

### Development Build

Build a development client for testing on physical devices:

```bash
# iOS
eas build --profile development --platform ios --local

# Android  
eas build --profile development --platform android --local
```

### Preview Build

Build for internal distribution (TestFlight/Internal Testing):

```bash
# iOS
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android
```

### Production Build

Build for app store submission:

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

## Automated Builds (CI/CD)

### GitHub Actions Setup

1. **Add GitHub Secrets**:
   - Go to Settings → Secrets → Actions
   - Add required secrets:
     - `EXPO_TOKEN`: Expo access token
     - `EXPO_APPLE_ID`: Apple ID email
     - `EXPO_APPLE_APP_SPECIFIC_PASSWORD`: App-specific password
     - `EXPO_ANDROID_KEYSTORE_ALIAS`
     - `EXPO_ANDROID_KEYSTORE_PASSWORD`
     - `EXPO_ANDROID_KEY_PASSWORD`

2. **Trigger Builds**:

```bash
# Push to main branch triggers production build
git push origin main

# Create pull request triggers preview build
# (builds Android only for faster feedback)

# Manual workflow dispatch for submission
# Go to Actions → Submit to App Stores → Run workflow
```

### Version Bumping

Use the automated version bump workflow:

```bash
# Go to Actions → Version Bump → Run workflow
# Select version type: patch, minor, or major
```

Or manually:

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## App Store Submission

### iOS App Store

1. **Prepare Metadata**:
   - App name: Enviroscan
   - Bundle ID: `com.willbullen.enviroscan`
   - Privacy Policy URL: https://your-domain.com/privacy
   - Support URL: https://your-domain.com/support

2. **Build and Submit**:

```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios --latest
```

3. **App Store Connect**:
   - Go to App Store Connect
   - Fill in app information
   - Add screenshots (required sizes: 6.5", 5.5", 12.9")
   - Set pricing and availability
   - Submit for review

### Android Play Store

1. **Prepare Metadata**:
   - App name: Enviroscan
   - Package name: `com.willbullen.enviroscan`
   - Privacy Policy URL: https://your-domain.com/privacy

2. **Build and Submit**:

```bash
# Build for Play Store
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android --latest
```

3. **Play Console**:
   - Go to Google Play Console
   - Create new app
   - Fill in store listing
   - Add screenshots (phone, tablet)
   - Set content rating
   - Submit for review

## Testing Builds

### TestFlight (iOS)

1. **Build and Submit to TestFlight**:

```bash
eas build --profile production --platform ios
eas submit --platform ios --latest
```

2. **Invite Testers**:
   - Go to App Store Connect → TestFlight
   - Add internal or external testers
   - Testers receive email invite

### Internal Testing (Android)

1. **Build and Upload**:

```bash
eas build --profile preview --platform android
# Upload to Play Console Internal Testing
```

2. **Invite Testers**:
   - Go to Play Console → Internal Testing
   - Add testers by email
   - Share testing link

## Build Profiles

### Development
- **Purpose**: Testing on physical devices with dev tools
- **Distribution**: Internal only
- **Features**: Dev menu, fast refresh, debugging enabled
- **Command**: `eas build --profile development`

### Preview
- **Purpose**: Internal distribution to testers
- **Distribution**: TestFlight / Internal Testing
- **Features**: Production-like but with lighter optimizations
- **Command**: `eas build --profile preview`

### Production
- **Purpose**: App Store / Play Store submission
- **Distribution**: Public release
- **Features**: Full optimizations, no debugging
- **Command**: `eas build --profile production`

## Troubleshooting

### Build Fails

```bash
# Clear EAS build cache
eas build --clear-cache

# Check build logs
eas build:list
eas build:view [BUILD_ID]
```

### Code Signing Issues (iOS)

```bash
# Reset credentials
eas credentials --reset

# Regenerate credentials
eas credentials
```

### Keystore Issues (Android)

```bash
# View current credentials
eas credentials

# Update keystore
eas credentials --platform android
```

### Metro Bundler Issues

```bash
# Clear all caches
npx expo start --clear
rm -rf node_modules
pnpm install
```

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle size
npx expo export --platform ios --output-dir dist
npx expo export --platform android --output-dir dist

# Check bundle size
du -sh dist/
```

### Build Time

- Use EAS Build cloud builders (faster than local)
- Enable caching in GitHub Actions
- Use incremental builds when possible

## Monitoring

### Sentry Integration (Optional)

```bash
# Install Sentry
pnpm add @sentry/react-native

# Configure in app.config.js
```

### Analytics (Optional)

```bash
# Install analytics
pnpm add expo-firebase-analytics

# Or use custom analytics
```

## Release Checklist

- [ ] Run tests: `pnpm test`
- [ ] Type check: `pnpm check`
- [ ] Lint code: `pnpm lint`
- [ ] Update version: `npm version [patch|minor|major]`
- [ ] Update CHANGELOG.md
- [ ] Build for iOS: `eas build --platform ios --profile production`
- [ ] Build for Android: `eas build --platform android --profile production`
- [ ] Test on physical devices
- [ ] Submit to TestFlight (iOS)
- [ ] Submit to Internal Testing (Android)
- [ ] Gather feedback from testers
- [ ] Fix critical bugs
- [ ] Submit to App Store
- [ ] Submit to Play Store
- [ ] Monitor crash reports
- [ ] Monitor user feedback

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://support.google.com/googleplay/android-developer/answer/9859455)
