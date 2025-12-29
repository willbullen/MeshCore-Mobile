# Enviroscan iOS Build - Final Instructions for MacinCloud

## Problem Summary

The iOS build was failing with: **"Unable to resolve module @babel/runtime/helpers/interopRequireDefault"**

This was caused by pnpm's symlink-based dependency resolution not being properly understood by Metro bundler during EAS Build.

## Root Cause

1. pnpm uses a virtual store with symlinks (not flat node_modules like npm)
2. Metro bundler wasn't configured to follow these symlinks
3. The @babel/runtime package couldn't be resolved during bundling

## Solution Applied

Three critical fixes have been implemented:

### Fix 1: Added @babel/runtime as explicit dependency
```json
"dependencies": {
  "@babel/runtime": "^7.26.0",
  ...
}
```

### Fix 2: Updated pnpm-lock.yaml
The lockfile now includes the @babel/runtime entry with proper resolution.

### Fix 3: Created metro.config.js
New configuration file that teaches Metro to:
- Enable symlink resolution for pnpm (`unstable_enableSymlinks: true`)
- Prefer the project's own node_modules via extraNodeModules proxy
- Properly resolve pnpm's virtual store

## Build Instructions for MacinCloud

### Step 1: Complete Clean Slate

```bash
# Navigate to home
cd ~

# Remove old repository completely
rm -rf MeshCore-Mobile

# Clone fresh copy
git clone https://github.com/willbullen/MeshCore-Mobile.git
cd MeshCore-Mobile
```

### Step 2: Install Dependencies

```bash
# Clear any old pnpm cache
pnpm store prune

# Install dependencies
~/.local/bin/pnpm install
```

**Expected output:** Should show @babel/runtime being installed

### Step 3: Verify Metro Config

```bash
# Verify metro.config.js exists
ls -la metro.config.js

# Should output:
# -rw-r--r--  1 user939734  staff  1234 Dec 29 09:XX metro.config.js
```

### Step 4: Run Prebuild

```bash
~/.local/bin/pnpm expo prebuild --platform ios --clean
```

**Expected output:**
```
✔ Cleared ios code
✔ Created native directory
✔ Updated package.json | no changes
✔ Finished prebuild
✔ Installed CocoaPods
```

### Step 5: Build iOS App

```bash
~/.local/bin/eas build --platform ios --profile production --local
```

**Expected behavior:**
- Build progresses through phases
- Metro bundler successfully bundles JavaScript
- Xcode compiles native code
- Generates .ipa file

**Success indicator:**
```
Build finished successfully
Archive location: /path/to/Enviroscan.ipa
```

## Troubleshooting

### If build still fails with @babel/runtime error:

1. **Verify metro.config.js is present:**
   ```bash
   cat metro.config.js | grep unstable_enableSymlinks
   ```
   Should output: `unstable_enableSymlinks: true,`

2. **Verify @babel/runtime is installed:**
   ```bash
   ls ~/.local/bin/pnpm list @babel/runtime
   ```
   Should show: `@babel/runtime@7.26.0`

3. **Check pnpm-lock.yaml:**
   ```bash
   grep "@babel/runtime" pnpm-lock.yaml
   ```
   Should show the dependency entry

### If CocoaPods fails:

```bash
# Clear CocoaPods cache
rm -rf ios/Pods
rm -rf ~/.cocoapods

# Retry prebuild
~/.local/bin/pnpm expo prebuild --platform ios --clean
```

### If code signing fails:

Use the skip configuration flag:
```bash
~/.local/bin/eas build --platform ios --profile production --local --skip-project-configuration
```

## What Changed in the Repository

| File | Change | Purpose |
|------|--------|---------|
| package.json | Added @babel/runtime: ^7.26.0 | Explicit dependency for Metro |
| pnpm-lock.yaml | Updated with @babel/runtime entry | Ensures proper resolution |
| metro.config.js | NEW - Symlink configuration | Teaches Metro to follow pnpm symlinks |
| app.json | Removed "type": "module" | Fixes TypeScript module errors |
| app.json | Removed expo-web-browser plugin | Fixes prebuild issues |

## Expected Build Time

- Prebuild: 2-5 minutes
- EAS Build: 20-40 minutes (first time, includes compilation)
- Total: ~30-50 minutes

## Success Verification

After successful build, you should have:

1. **Build completion message** in terminal
2. **Path to .ipa file** in the output
3. **No Metro bundler errors** about @babel/runtime
4. **No code signing errors** (or handled with --skip-project-configuration)

## Next Steps After Build

Once you have the .ipa file:

```bash
# Option 1: Submit to App Store via EAS
~/.local/bin/eas submit --platform ios --path /path/to/Enviroscan.ipa

# Option 2: Manual upload via Xcode
# 1. Open Xcode
# 2. Window → Organizer
# 3. Select the archive
# 4. Click "Distribute App"
# 5. Follow the wizard
```

## Key Differences from Previous Attempts

| Previous | Now |
|----------|-----|
| No metro.config.js | ✅ Metro configured for pnpm |
| @babel/runtime not explicit | ✅ Added to package.json |
| Old pnpm-lock.yaml | ✅ Updated with all dependencies |
| No symlink handling | ✅ Metro understands pnpm structure |

## Important Notes

- **Do NOT use npm** - stick with pnpm (already installed at ~/.local/bin/pnpm)
- **Do NOT modify metro.config.js** - it's been carefully configured
- **Do NOT skip prebuild** - it generates necessary iOS native code
- **Do commit all changes** - the fixes are in the GitHub repository

## Contact & Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all three fixes are in place (metro.config.js, package.json, pnpm-lock.yaml)
3. Try a complete clean clone if issues persist
4. Check the BUILD_ANALYSIS.md for detailed technical explanation

---

**Latest Commit:** df4963a - "Fix: Add metro.config.js to resolve pnpm @babel/runtime issues"

**Repository:** https://github.com/willbullen/MeshCore-Mobile
