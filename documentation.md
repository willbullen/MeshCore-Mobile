# MeshCore Mobile - Technical Documentation Reference

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Author:** Manus AI

---

## Overview

This document provides a comprehensive reference to all documentation resources for the technologies, frameworks, and libraries used in the MeshCore Mobile application. Each section includes official documentation links, getting started guides, and relevant API references.

---

## Table of Contents

1. [Core Framework](#1-core-framework)
2. [Navigation & Routing](#2-navigation--routing)
3. [State Management](#3-state-management)
4. [Bluetooth & Connectivity](#4-bluetooth--connectivity)
5. [UI Components & Styling](#5-ui-components--styling)
6. [Animation & Gestures](#6-animation--gestures)
7. [Native Features](#7-native-features)
8. [Backend & API](#8-backend--api)
9. [Database](#9-database)
10. [Build & Deployment](#10-build--deployment)
11. [Development Tools](#11-development-tools)
12. [MeshCore Ecosystem](#12-meshcore-ecosystem)

---

## 1. Core Framework

### Expo SDK 54

The application is built on Expo SDK 54, providing a managed workflow for React Native development.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/ |
| **SDK 54 Release Notes** | https://expo.dev/changelog/2024/12-10-sdk-54 |
| **Getting Started Guide** | https://docs.expo.dev/get-started/introduction/ |
| **API Reference** | https://docs.expo.dev/versions/latest/ |
| **Configuration (app.json)** | https://docs.expo.dev/versions/latest/config/app/ |
| **Environment Variables** | https://docs.expo.dev/guides/environment-variables/ |
| **Expo Go App** | https://expo.dev/go |
| **GitHub Repository** | https://github.com/expo/expo |

### React Native 0.81

The underlying mobile framework powering the application.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://reactnative.dev/docs/getting-started |
| **Core Components** | https://reactnative.dev/docs/components-and-apis |
| **New Architecture** | https://reactnative.dev/docs/the-new-architecture/landing-page |
| **Performance Guide** | https://reactnative.dev/docs/performance |
| **Debugging Guide** | https://reactnative.dev/docs/debugging |
| **Platform Specific Code** | https://reactnative.dev/docs/platform-specific-code |
| **GitHub Repository** | https://github.com/facebook/react-native |

### React 19

The UI library for building component-based interfaces.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://react.dev/ |
| **React 19 Features** | https://react.dev/blog/2024/12/05/react-19 |
| **Hooks Reference** | https://react.dev/reference/react/hooks |
| **useEffect Guide** | https://react.dev/reference/react/useEffect |
| **useState Guide** | https://react.dev/reference/react/useState |
| **useCallback Guide** | https://react.dev/reference/react/useCallback |
| **useMemo Guide** | https://react.dev/reference/react/useMemo |

### TypeScript 5.9

Static type checking for JavaScript.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://www.typescriptlang.org/docs/ |
| **TypeScript Handbook** | https://www.typescriptlang.org/docs/handbook/intro.html |
| **React TypeScript Cheatsheet** | https://react-typescript-cheatsheet.netlify.app/ |
| **TSConfig Reference** | https://www.typescriptlang.org/tsconfig |
| **Utility Types** | https://www.typescriptlang.org/docs/handbook/utility-types.html |

---

## 2. Navigation & Routing

### Expo Router 6

File-based routing for React Native applications.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/router/introduction/ |
| **File-Based Routing** | https://docs.expo.dev/router/basics/file-based-routing/ |
| **Navigation Patterns** | https://docs.expo.dev/router/basics/navigation/ |
| **Tab Navigation** | https://docs.expo.dev/router/advanced/tabs/ |
| **Stack Navigation** | https://docs.expo.dev/router/advanced/stack/ |
| **Modal Screens** | https://docs.expo.dev/router/advanced/modals/ |
| **Deep Linking** | https://docs.expo.dev/router/reference/url-parameters/ |
| **Typed Routes** | https://docs.expo.dev/router/reference/typed-routes/ |

### React Navigation 7

The underlying navigation library used by Expo Router.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://reactnavigation.org/docs/getting-started |
| **Bottom Tabs** | https://reactnavigation.org/docs/bottom-tab-navigator |
| **Stack Navigator** | https://reactnavigation.org/docs/stack-navigator |
| **Navigation State** | https://reactnavigation.org/docs/navigation-state |
| **Screen Options** | https://reactnavigation.org/docs/screen-options |
| **Themes** | https://reactnavigation.org/docs/themes |

---

## 3. State Management

### TanStack Query (React Query) 5

Server state management and data fetching.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://tanstack.com/query/latest/docs/framework/react/overview |
| **Quick Start** | https://tanstack.com/query/latest/docs/framework/react/quick-start |
| **useQuery Hook** | https://tanstack.com/query/latest/docs/framework/react/reference/useQuery |
| **useMutation Hook** | https://tanstack.com/query/latest/docs/framework/react/reference/useMutation |
| **Query Invalidation** | https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation |
| **Optimistic Updates** | https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates |
| **Offline Support** | https://tanstack.com/query/latest/docs/framework/react/guides/offline |

### AsyncStorage

Local key-value storage for React Native.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://react-native-async-storage.github.io/async-storage/docs/install |
| **API Reference** | https://react-native-async-storage.github.io/async-storage/docs/api |
| **Usage Guide** | https://react-native-async-storage.github.io/async-storage/docs/usage |
| **GitHub Repository** | https://github.com/react-native-async-storage/async-storage |

---

## 4. Bluetooth & Connectivity

### React Native BLE PLX

Bluetooth Low Energy library for React Native.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://dotintent.github.io/react-native-ble-plx/ |
| **Getting Started** | https://dotintent.github.io/react-native-ble-plx/#getting-started |
| **API Reference** | https://dotintent.github.io/react-native-ble-plx/#api-reference |
| **BleManager Class** | https://dotintent.github.io/react-native-ble-plx/#blemanager |
| **Device Class** | https://dotintent.github.io/react-native-ble-plx/#device |
| **Characteristic Class** | https://dotintent.github.io/react-native-ble-plx/#characteristic |
| **GitHub Repository** | https://github.com/dotintent/react-native-ble-plx |
| **Example App** | https://github.com/dotintent/react-native-ble-plx/tree/master/example |

### WebSocket API

Native WebSocket implementation for real-time communication.

| Resource | URL |
|----------|-----|
| **React Native WebSocket** | https://reactnative.dev/docs/network#websocket-support |
| **MDN WebSocket API** | https://developer.mozilla.org/en-US/docs/Web/API/WebSocket |
| **WebSocket Protocol (RFC 6455)** | https://datatracker.ietf.org/doc/html/rfc6455 |

---

## 5. UI Components & Styling

### Expo Vector Icons

Icon library with multiple icon sets.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/guides/icons/ |
| **Icon Directory** | https://icons.expo.fyi/ |
| **GitHub Repository** | https://github.com/expo/vector-icons |
| **MaterialIcons Reference** | https://fonts.google.com/icons |
| **SF Symbols Reference** | https://developer.apple.com/sf-symbols/ |

### Expo Image

High-performance image component.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/image/ |
| **API Reference** | https://docs.expo.dev/versions/latest/sdk/image/#api |
| **Image Caching** | https://docs.expo.dev/versions/latest/sdk/image/#caching |
| **Placeholder Support** | https://docs.expo.dev/versions/latest/sdk/image/#placeholder |

### React Native SVG

SVG support for React Native.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://github.com/software-mansion/react-native-svg#readme |
| **API Reference** | https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md |
| **Supported Elements** | https://github.com/software-mansion/react-native-svg#supported-elements |

### Safe Area Context

Safe area insets handling.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/safe-area-context/ |
| **useSafeAreaInsets Hook** | https://github.com/th3rdwave/react-native-safe-area-context#usesafeareainsets |
| **SafeAreaView Component** | https://github.com/th3rdwave/react-native-safe-area-context#safeareaview |

---

## 6. Animation & Gestures

### React Native Reanimated 4

High-performance animations library.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.swmansion.com/react-native-reanimated/ |
| **Getting Started** | https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started |
| **Shared Values** | https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#shared-value |
| **useAnimatedStyle** | https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle |
| **withSpring** | https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring |
| **withTiming** | https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming |
| **Layout Animations** | https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations |
| **GitHub Repository** | https://github.com/software-mansion/react-native-reanimated |

### React Native Gesture Handler

Touch and gesture handling library.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.swmansion.com/react-native-gesture-handler/ |
| **Getting Started** | https://docs.swmansion.com/react-native-gesture-handler/docs/ |
| **Gesture API** | https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture |
| **Pan Gesture** | https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture |
| **Tap Gesture** | https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture |
| **GitHub Repository** | https://github.com/software-mansion/react-native-gesture-handler |

---

## 7. Native Features

### Expo Haptics

Haptic feedback for touch interactions.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/haptics/ |
| **Impact Feedback** | https://docs.expo.dev/versions/latest/sdk/haptics/#hapticsimpactasyncstyle |
| **Notification Feedback** | https://docs.expo.dev/versions/latest/sdk/haptics/#hapticsnotificationasynctype |

### Expo Local Authentication

Biometric authentication (Face ID, Touch ID, Fingerprint).

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/local-authentication/ |
| **Authentication Methods** | https://docs.expo.dev/versions/latest/sdk/local-authentication/#localauthenticationsupportedauthenticationtypesasync |
| **Authenticate Function** | https://docs.expo.dev/versions/latest/sdk/local-authentication/#localauthenticationauthenticateasyncoptions |

### Expo Secure Store

Encrypted key-value storage.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/securestore/ |
| **API Reference** | https://docs.expo.dev/versions/latest/sdk/securestore/#api |
| **Security Considerations** | https://docs.expo.dev/versions/latest/sdk/securestore/#security |

### Expo AV

Audio and video playback.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/av/ |
| **Audio API** | https://docs.expo.dev/versions/latest/sdk/audio/ |
| **Video Component** | https://docs.expo.dev/versions/latest/sdk/video/ |
| **Background Audio** | https://docs.expo.dev/versions/latest/sdk/audio/#playing-sounds-in-the-background |

### Expo Keep Awake

Prevent device screen from sleeping.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/keep-awake/ |
| **useKeepAwake Hook** | https://docs.expo.dev/versions/latest/sdk/keep-awake/#usekeepawaketag |

### Expo Linking

Deep linking and URL handling.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/linking/ |
| **Deep Links** | https://docs.expo.dev/guides/deep-linking/ |
| **URL Schemes** | https://docs.expo.dev/versions/latest/sdk/linking/#linkingcreateurlpath-namedparameters |

### Expo Web Browser

In-app browser for OAuth and external links.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/versions/latest/sdk/webbrowser/ |
| **OAuth Authentication** | https://docs.expo.dev/versions/latest/sdk/webbrowser/#webbrowseropenauthsessionasyncurl-redirecturl-options |

---

## 8. Backend & API

### tRPC 11

End-to-end typesafe API layer.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://trpc.io/docs |
| **Getting Started** | https://trpc.io/docs/getting-started |
| **React Query Integration** | https://trpc.io/docs/client/react |
| **Procedures** | https://trpc.io/docs/server/procedures |
| **Context** | https://trpc.io/docs/server/context |
| **Error Handling** | https://trpc.io/docs/server/error-handling |
| **GitHub Repository** | https://github.com/trpc/trpc |

### Express.js

Node.js web framework for the backend server.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://expressjs.com/ |
| **Getting Started** | https://expressjs.com/en/starter/installing.html |
| **Routing** | https://expressjs.com/en/guide/routing.html |
| **Middleware** | https://expressjs.com/en/guide/using-middleware.html |
| **Error Handling** | https://expressjs.com/en/guide/error-handling.html |

### Axios

HTTP client for API requests.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://axios-http.com/docs/intro |
| **Request Config** | https://axios-http.com/docs/req_config |
| **Response Schema** | https://axios-http.com/docs/res_schema |
| **Interceptors** | https://axios-http.com/docs/interceptors |
| **Error Handling** | https://axios-http.com/docs/handling_errors |

### Zod

TypeScript-first schema validation.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://zod.dev/ |
| **Basic Usage** | https://zod.dev/?id=basic-usage |
| **Primitives** | https://zod.dev/?id=primitives |
| **Objects** | https://zod.dev/?id=objects |
| **Type Inference** | https://zod.dev/?id=type-inference |
| **GitHub Repository** | https://github.com/colinhacks/zod |

---

## 9. Database

### Drizzle ORM

TypeScript ORM for SQL databases.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://orm.drizzle.team/docs/overview |
| **Getting Started** | https://orm.drizzle.team/docs/get-started |
| **MySQL Dialect** | https://orm.drizzle.team/docs/get-started-mysql |
| **Schema Declaration** | https://orm.drizzle.team/docs/sql-schema-declaration |
| **Queries** | https://orm.drizzle.team/docs/rqb |
| **Migrations** | https://orm.drizzle.team/docs/migrations |
| **Drizzle Kit** | https://orm.drizzle.team/kit-docs/overview |
| **GitHub Repository** | https://github.com/drizzle-team/drizzle-orm |

### MySQL

Relational database system.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://dev.mysql.com/doc/ |
| **mysql2 npm Package** | https://github.com/sidorares/node-mysql2 |
| **Connection Options** | https://github.com/sidorares/node-mysql2#using-connection-pools |

---

## 10. Build & Deployment

### EAS Build

Expo Application Services for building native apps.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/build/introduction/ |
| **Getting Started** | https://docs.expo.dev/build/setup/ |
| **Build Configuration** | https://docs.expo.dev/build/eas-json/ |
| **iOS Builds** | https://docs.expo.dev/build/ios/ |
| **Android Builds** | https://docs.expo.dev/build/android/ |
| **Local Builds** | https://docs.expo.dev/build-reference/local-builds/ |
| **Build Profiles** | https://docs.expo.dev/build/eas-json/#build-profiles |
| **Environment Variables** | https://docs.expo.dev/build-reference/variables/ |

### EAS Submit

App store submission service.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://docs.expo.dev/submit/introduction/ |
| **iOS Submission** | https://docs.expo.dev/submit/ios/ |
| **Android Submission** | https://docs.expo.dev/submit/android/ |

### Metro Bundler

JavaScript bundler for React Native.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://metrobundler.dev/ |
| **Configuration** | https://metrobundler.dev/docs/configuration |
| **Resolver** | https://metrobundler.dev/docs/resolution |
| **Caching** | https://metrobundler.dev/docs/caching |

### Babel

JavaScript compiler.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://babeljs.io/docs/ |
| **Configuration** | https://babeljs.io/docs/configuration |
| **Presets** | https://babeljs.io/docs/presets |
| **babel-preset-expo** | https://docs.expo.dev/versions/latest/sdk/babel-preset-expo/ |

---

## 11. Development Tools

### pnpm

Fast, disk space efficient package manager.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://pnpm.io/ |
| **Installation** | https://pnpm.io/installation |
| **CLI Commands** | https://pnpm.io/cli/add |
| **pnpm-lock.yaml** | https://pnpm.io/git#lockfiles |
| **Workspaces** | https://pnpm.io/workspaces |

### ESLint

JavaScript/TypeScript linting.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://eslint.org/docs/latest/ |
| **Configuration** | https://eslint.org/docs/latest/use/configure/ |
| **eslint-config-expo** | https://github.com/expo/expo/tree/main/packages/eslint-config-expo |

### Prettier

Code formatter.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://prettier.io/docs/en/ |
| **Configuration** | https://prettier.io/docs/en/configuration.html |
| **Options** | https://prettier.io/docs/en/options.html |

### Vitest

Unit testing framework.

| Resource | URL |
|----------|-----|
| **Official Documentation** | https://vitest.dev/ |
| **Getting Started** | https://vitest.dev/guide/ |
| **API Reference** | https://vitest.dev/api/ |
| **Mocking** | https://vitest.dev/guide/mocking.html |

---

## 12. MeshCore Ecosystem

### MeshCore Protocol

The underlying mesh networking protocol.

| Resource | URL |
|----------|-----|
| **GitHub Repository** | https://github.com/ripplebiz/MeshCore |
| **Protocol Specification** | https://github.com/ripplebiz/MeshCore/blob/main/docs/protocol.md |
| **Packet Types** | https://github.com/ripplebiz/MeshCore/blob/main/docs/packets.md |

### MeshCore Bridge

Companion server application for MeshCore.

| Resource | URL |
|----------|-----|
| **GitHub Repository** | https://github.com/willbullen/MeshCore-Bridge |
| **Deployment Guide** | https://github.com/willbullen/MeshCore-Bridge/blob/main/DEPLOYMENT_GUIDE.md |
| **README** | https://github.com/willbullen/MeshCore-Bridge/blob/main/README.md |

### RAK WisBlock

Hardware platform for MeshCore nodes.

| Resource | URL |
|----------|-----|
| **RAK4631 Documentation** | https://docs.rakwireless.com/Product-Categories/WisBlock/RAK4631/Overview/ |
| **RAK4631 Datasheet** | https://docs.rakwireless.com/Product-Categories/WisBlock/RAK4631/Datasheet/ |
| **WisBlock Quick Start** | https://docs.rakwireless.com/Product-Categories/WisBlock/Quickstart/ |
| **RAK Store** | https://store.rakwireless.com/ |

### Heltec

Alternative hardware platform.

| Resource | URL |
|----------|-----|
| **Heltec Documentation** | https://docs.heltec.org/ |
| **WiFi LoRa 32** | https://docs.heltec.org/en/node/esp32/wifi_lora_32/index.html |

---

## Additional Resources

### Apple Human Interface Guidelines

Design guidelines for iOS applications.

| Resource | URL |
|----------|-----|
| **HIG Home** | https://developer.apple.com/design/human-interface-guidelines/ |
| **iOS Guidelines** | https://developer.apple.com/design/human-interface-guidelines/platforms/designing-for-ios |
| **App Icons** | https://developer.apple.com/design/human-interface-guidelines/app-icons |
| **Typography** | https://developer.apple.com/design/human-interface-guidelines/typography |
| **Color** | https://developer.apple.com/design/human-interface-guidelines/color |

### Material Design

Design guidelines for Android applications.

| Resource | URL |
|----------|-----|
| **Material Design 3** | https://m3.material.io/ |
| **Components** | https://m3.material.io/components |
| **Color System** | https://m3.material.io/styles/color/overview |
| **Typography** | https://m3.material.io/styles/typography/overview |

### Bluetooth Low Energy

BLE protocol documentation.

| Resource | URL |
|----------|-----|
| **Bluetooth SIG** | https://www.bluetooth.com/specifications/specs/ |
| **GATT Specifications** | https://www.bluetooth.com/specifications/gatt/ |
| **Nordic UART Service** | https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/libraries/bluetooth_services/services/nus.html |

---

## Version Compatibility Matrix

| Package | Version | Expo SDK 54 Compatible |
|---------|---------|------------------------|
| expo | ~54.0.30 | ✅ |
| react-native | 0.81.5 | ✅ |
| react | 19.1.0 | ✅ |
| expo-router | ~6.0.21 | ✅ |
| react-native-reanimated | ~4.1.6 | ✅ |
| react-native-gesture-handler | ~2.28.0 | ✅ |
| react-native-screens | ~4.16.0 | ✅ |
| react-native-safe-area-context | 5.6.2 | ✅ |
| react-native-ble-plx | ^3.5.0 | ✅ |
| @tanstack/react-query | ^5.60.0 | ✅ |
| drizzle-orm | ^0.44.5 | ✅ |
| typescript | ~5.9.3 | ✅ |

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-30 | 1.0 | Initial documentation release |

---

*This document is maintained as part of the MeshCore Mobile project. For updates or corrections, please submit a pull request to the repository.*
