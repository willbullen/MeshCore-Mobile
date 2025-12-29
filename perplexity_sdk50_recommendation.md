# Perplexity Recommendation: Expo SDK 50

**Date:** December 29, 2024

## Key Finding

**Expo SDK 50 is the most stable version for EAS Build iOS** as of late 2024.

## Why SDK 50?

1. ✅ **Official stable release** (January 2024) with EAS optimizations
2. ✅ **No widespread iOS build failures** reported
3. ✅ **Pre-warmed CocoaPods caching** for faster builds
4. ✅ **Xcode 15 support** with build annotations
5. ✅ **Production-ready** - Used by production Expo apps in 2024-2025

## Confirmed Issues with SDKs 51-54

### SDK 54
- ❌ Folly coroutine errors: `'folly/coro/Coroutine.h' not found`
- Caused by React Native/Folly version mismatches with Swift coroutines

### SDK 53
- ❌ Swift API errors: `'some View' has no member 'onGeometryChange'`
- expo-router/SwiftUI incompatibilities not stabilized for EAS

### SDK 52 & 51
- ❌ **TypeScript errors: "Unknown file extension '.ts'" in expo-modules-core**
- **This is a KNOWN BUG** across these versions
- Caused by TypeScript resolution failures in EAS's Node/CocoaPods environment
- Downgrading expo-modules-core doesn't reliably fix it due to SDK pinning

## Official Recommendations

- Use SDK 50 immediately for stable iOS EAS builds
- Supports Node 18+, iOS 13.4+ target
- Compatible with react-native-ble-plx, expo-router, tRPC
- **Do NOT wait for fixes in SDKs 51-54**
- Upgrade incrementally per official guidance

## Next Steps

```bash
# 1. Downgrade to SDK 50
npx expo install expo@^50.0.0 --fix

# 2. Run health check
npx expo-doctor

# 3. Clear EAS cache and build
eas build --platform ios --profile preview --clear-cache
```

## Package Manager

- Stick to **pnpm** (avoid npm's ajv/dist/compile/codegen errors)
- Clean node_modules if switching: `rm -rf node_modules && pnpm install`

## Production Evidence

- SDK 50 fully released January 2024 with EAS optimizations
- Community reports highlight SDK 50's reliability for prebuild/EAS workflows
- No systemic failure reports vs. beta/newer SDKs
- Production Expo apps favor SDK 50 for stable iOS builds in 2024-2025
