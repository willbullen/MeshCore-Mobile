# MacinCloud iOS Build Instructions

## Prerequisites
- MacinCloud Mac Mini M1 with macOS Ventura 13.7.8 (Xcode 15.2)
- Node.js, pnpm, and eas-cli installed
- Repository cloned at ~/MeshCore-Mobile
- Apple Developer account credentials ready

## Step 1: Pull Latest Fixes

```bash
cd ~/MeshCore-Mobile
git pull origin main
```

**What was fixed:**
- Removed `"type": "module"` from package.json (fixes expo-modules-core TypeScript errors)
- Removed expo-web-browser from app.json plugins (fixes prebuild issues)

## Step 2: Clean and Reinstall Dependencies

```bash
# Remove old node_modules and iOS folder
rm -rf node_modules ios

# Install dependencies
pnpm install
```

## Step 3: Run Expo Prebuild

```bash
# Regenerate iOS folder with fixed configuration
pnpm expo prebuild --platform ios --clean
```

**Expected output:**
- iOS folder created successfully
- No TypeScript module errors
- No expo-web-browser plugin errors

## Step 4: Build with EAS (Local Build)

### Option A: Local Build with Project Configuration
```bash
eas build --platform ios --profile production --local
```

### Option B: Local Build Skipping Project Configuration (if code signing issues)
```bash
eas build --platform ios --profile production --local --skip-project-configuration
```

**What this does:**
- Builds the iOS app on the MacinCloud machine (not EAS servers)
- Uses the production profile from eas.json
- Generates a .ipa file for App Store submission

## Step 5: If Build Succeeds

If the build completes successfully, you'll have a .ipa file. Submit it to App Store:

```bash
eas submit --platform ios --path <path-to-ipa>
```

Or manually upload via Xcode:
1. Open Xcode
2. Window → Organizer
3. Select the archive
4. Click "Distribute App"
5. Follow the App Store submission wizard

## Troubleshooting

### Issue: Code Signing Errors
**Solution:** Use `--skip-project-configuration` flag or configure signing in Xcode manually

### Issue: "EMFILE: too many open files"
**Solution:** Increase file watch limit:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue: TypeScript Errors During Build
**Solution:** Verify the fixes were applied:
```bash
# Check package.json does NOT have "type": "module"
grep '"type"' package.json

# Check app.json does NOT have expo-web-browser in plugins
grep 'expo-web-browser' app.json
```

### Issue: Prebuild Fails
**Solution:** Clear all caches and retry:
```bash
rm -rf node_modules ios .expo
pnpm store prune
pnpm install
pnpm expo prebuild --platform ios --clean
```

## Alternative: Direct Xcode Build

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

## Build Profiles (eas.json)

The production profile is configured with:
- iOS simulator: false
- Distribution: store
- Build image: macos-sonoma-14.5-xcode-15.4

## Expected Build Time

- Prebuild: 2-5 minutes
- EAS local build: 15-30 minutes
- Xcode archive: 10-20 minutes

## Success Indicators

✅ Prebuild completes without errors
✅ iOS folder contains valid Xcode project
✅ Build completes and generates .ipa file
✅ Archive appears in Xcode Organizer

## Contact

If you encounter issues not covered here:
- Check the GitHub repository for updates: https://github.com/willbullen/MeshCore-Mobile
- Review EAS Build logs for specific error messages
- Ensure Apple Developer account is active and certificates are valid
