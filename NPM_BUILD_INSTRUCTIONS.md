# Enviroscan iOS Build - NPM-Based Instructions

## Critical Change: Switched from pnpm to npm

The `@babel/runtime` resolution errors were caused by **pnpm's symlink-based dependency structure** which EAS Build's Metro bundler cannot properly resolve.

**Solution:** We've switched to npm which creates a flat `node_modules` structure that Metro can resolve correctly.

## MacinCloud Build Instructions

### Step 1: Fresh Clone

```bash
cd ~
rm -rf MeshCore-Mobile
git clone https://github.com/willbullen/MeshCore-Mobile.git
cd MeshCore-Mobile
```

### Step 2: Install Dependencies with npm

```bash
npm install
```

**Note:** The `.npmrc` file contains `legacy-peer-deps=true` to handle peer dependency conflicts.

### Step 3: Verify Installation

```bash
# Check @babel/runtime is installed
ls node_modules/@babel/runtime/helpers/interopRequireDefault.js

# Should output the file path (not an error)
```

### Step 4: Run Prebuild

```bash
npx expo prebuild --platform ios --clean
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
eas build --platform ios --profile production --local
```

## Why This Works

| pnpm (old) | npm (new) |
|------------|-----------|
| Symlinked node_modules | Flat node_modules |
| Metro can't follow symlinks | Metro resolves directly |
| @babel/runtime not found | @babel/runtime found |

## Key Files Changed

1. **package.json** - Removed `packageManager` field, changed scripts from `pnpm` to `npm run`
2. **package-lock.json** - Added (npm lockfile)
3. **pnpm-lock.yaml** - Deleted
4. **.npmrc** - Added with `legacy-peer-deps=true`
5. **babel.config.js** - Added for Expo

## Troubleshooting

### If npm install fails:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### If prebuild fails:
```bash
rm -rf ios
npx expo prebuild --platform ios --clean
```

### If build still shows @babel/runtime error:
```bash
# Verify the file exists
ls -la node_modules/@babel/runtime/helpers/

# Should show interopRequireDefault.js
```

## Repository

**URL:** https://github.com/willbullen/MeshCore-Mobile
**Latest Commit:** b530dc2 - "CRITICAL FIX: Switch from pnpm to npm for EAS Build compatibility"
