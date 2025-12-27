# Privacy Policy for Enviroscan

**Last Updated: December 27, 2024**

## Introduction

This Privacy Policy describes how Enviroscan ("we", "our", or "the app") collects, uses, and protects your information when you use our mobile application.

## Information We Collect

### 1. Bluetooth Data
Enviroscan uses Bluetooth Low Energy (BLE) to connect to compatible LoRa mesh network devices (such as RAK4631). We collect:
- Device identifiers (MAC addresses, device names)
- Signal strength (RSSI) and quality (SNR) measurements
- Telemetry data from connected sensors (battery level, temperature, humidity, etc.)
- Messages sent and received through the mesh network

**Purpose**: To enable communication with mesh network devices and display network status.

### 2. Location Data
iOS requires location permissions to use Bluetooth. We collect:
- Approximate device location (when Bluetooth scanning is active)
- GPS coordinates from connected mesh network nodes (if available)

**Purpose**: Required by iOS for Bluetooth functionality and to display node locations on the map.

### 3. Locally Stored Data
The app stores data locally on your device:
- Authentication status (biometric login state)
- First-launch flag (to show intro screen once)
- Message history and conversation data
- Node information and network topology
- User preferences and settings

**Purpose**: To provide app functionality and improve user experience.

## How We Use Your Information

We use the collected information to:
- Connect to and communicate with mesh network devices
- Display network topology and node locations on the map
- Show message history and conversations
- Monitor network health and device telemetry
- Provide biometric authentication for app security

## Data Storage and Security

### Local Storage
All data is stored locally on your device using:
- AsyncStorage for preferences and authentication state
- Device secure storage for biometric authentication data

### Backend Integration (Optional)
If you configure a backend server:
- Data may be transmitted to your configured Django backend via WebSocket/REST API
- You control the backend server and its data retention policies
- We do not operate or control any backend servers

### Security Measures
- Biometric authentication (Face ID/Touch ID/Fingerprint) protects app access
- Bluetooth communication uses standard BLE security protocols
- No data is transmitted to third parties without your explicit configuration

## Data Sharing

We do NOT:
- Sell your personal information to third parties
- Share your data with advertisers
- Use your data for marketing purposes
- Transmit data to any servers we control (we don't operate any servers)

You MAY share data if:
- You configure a backend server (you control this)
- You manually export or share data from the app

## Third-Party Services

### Expo Platform
The app is built using Expo, which may collect:
- Crash reports and error logs (if enabled)
- Anonymous usage analytics (if enabled)

For Expo's privacy policy, visit: https://expo.dev/privacy

### Backend Services (Optional)
If you connect to a Django backend:
- That backend's privacy policy applies
- You control what data is sent to the backend
- We are not responsible for third-party backend services

## Your Rights

You have the right to:
- **Access**: View all data stored in the app
- **Delete**: Clear all app data by uninstalling the app or using app settings
- **Control**: Disable Bluetooth, location, or biometric authentication at any time
- **Export**: Manually export message and node data (if implemented)

## Children's Privacy

Enviroscan is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by:
- Updating the "Last Updated" date at the top of this policy
- Posting the new policy in the app repository

## Data Retention

- **Local data**: Retained until you uninstall the app or clear app data
- **Backend data**: Controlled by your backend server's retention policy (if configured)

## Permissions Explained

### Bluetooth Permission
**Required**: YES  
**Purpose**: Connect to LoRa mesh network devices  
**Data Collected**: Device identifiers, signal strength, telemetry data

### Location Permission
**Required**: YES (iOS requirement for Bluetooth)  
**Purpose**: Required by iOS to use Bluetooth; optionally display node locations  
**Data Collected**: Approximate device location, GPS coordinates from nodes

### Biometric Permission
**Required**: NO  
**Purpose**: Secure app access with Face ID/Touch ID/Fingerprint  
**Data Collected**: Biometric authentication result (not the biometric data itself)

## Disclaimer

**FOR INFORMATIONAL PURPOSES ONLY**

Enviroscan is provided for informational and monitoring purposes only. The app is NOT intended for:
- Safety-critical applications
- Medical or health-related decisions
- Life-support systems
- Applications where failure could lead to injury or property damage

**Data accuracy depends on sensor hardware quality and configuration. We do not guarantee the accuracy, reliability, or availability of data provided by connected sensors.**

## Contact Information

For questions about this Privacy Policy or data practices, please contact:

**Email**: admin@enviroscan.io  
**GitHub**: https://github.com/willbullen/MeshCore-Mobile

## Legal Compliance

This app complies with:
- Apple App Store Review Guidelines
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

## Consent

By using Enviroscan, you consent to this Privacy Policy and agree to its terms.

---

**Note**: This privacy policy is provided as-is for informational purposes. For legal advice specific to your jurisdiction, consult a qualified attorney.
