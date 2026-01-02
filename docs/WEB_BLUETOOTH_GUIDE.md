# Web Bluetooth Guide

## Overview

MeshCore Mobile now supports **Web Bluetooth API** when running in a web browser! This means you can connect to RAK4631/Heltec mesh devices directly from your browser without needing a mobile device.

## Browser Support

### ✅ Supported Browsers
- **Chrome** 56+ (Windows, macOS, Linux, Android)
- **Edge** 79+ (Windows, macOS)
- **Opera** 43+ (Windows, macOS, Linux, Android)

### ❌ Not Supported
- **Safari** - Apple hasn't implemented Web Bluetooth
- **Firefox** - Disabled by default (can enable via flags)
- **iOS browsers** - All use WebKit (no Web Bluetooth)

## How It Works

When you run the app in a supported browser:

1. Click "Scan for Devices" in the Connect tab
2. Browser shows a native device picker dialog
3. Select your RAK4631/Heltec device
4. App connects via Bluetooth
5. Full functionality works: messaging, node data, telemetry

## Getting Started

### 1. Start Web Server

```bash
cd MeshCore-Mobile
pnpm dev:metro
```

Opens at: http://localhost:8081

### 2. Open in Supported Browser

Use **Chrome** or **Edge** for best experience.

### 3. Enable Bluetooth

Ensure Bluetooth is enabled on your computer:
- **Windows**: Settings → Bluetooth & devices → On
- **macOS**: System Preferences → Bluetooth → On
- **Linux**: Check Bluetooth is enabled and paired

### 4. Connect to Device

1. Navigate to Connect tab
2. Click "Scan for Devices"
3. Browser will show device picker
4. Select your mesh device (RAK, Mesh, or Heltec)
5. Click "Pair"
6. Device connects automatically

## Features Available on Web

### ✅ Fully Functional
- **BLE Scanning** - Device picker dialog
- **BLE Connection** - Connect/disconnect
- **Send Messages** - Full messaging support
- **Receive Messages** - Real-time notifications
- **Node Data** - Telemetry and metrics
- **All UI Features** - Dashboard, messages, nodes, chat

### ⚠️ Web-Specific Limitations
- **No Background Scanning** - Must click "Scan" button (browser security)
- **RSSI Not Available** - Web Bluetooth doesn't expose signal strength
- **User Gesture Required** - Scan must be triggered by user click
- **HTTPS Required** - Must use HTTPS in production (localhost works for dev)

### ❌ Not Available on Web
- **Native Maps** - Shows fallback with Google Maps links
- **Background Operation** - Tab must stay open
- **Automatic Reconnection** - May need manual reconnect

## Security Considerations

### HTTPS Requirement

Web Bluetooth requires HTTPS (except localhost):

**Development** (localhost):
```bash
pnpm dev:metro
# Works at http://localhost:8081
```

**Production** (must use HTTPS):
```nginx
server {
    listen 443 ssl;
    server_name meshcore.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8081;
    }
}
```

### User Permissions

The browser will:
1. Ask user to select device (no automatic scanning)
2. Show permission prompt for pairing
3. Remember pairing for future connections
4. Allow user to revoke access anytime

## Implementation Details

### Web-Specific BLE Service

The app now has two BLE implementations:

**Native** ([lib/ble-service.ts](lib/ble-service.ts)):
- Uses `react-native-ble-plx`
- Works on iOS/Android development builds
- Full BLE scanning capabilities

**Web** ([lib/ble-service.web.ts](lib/ble-service.web.ts)):
- Uses Web Bluetooth API
- Works in Chrome/Edge/Opera
- User-initiated device selection

Metro bundler automatically uses the correct file based on platform:
- Native: `ble-service.ts`
- Web: `ble-service.web.ts`

### How to Extend

If you need to add web-specific features, use platform-specific files:

```typescript
// lib/my-service.ts (native)
export class MyService {
  // Native implementation
}

// lib/my-service.web.ts (web)
export class MyService {
  // Web implementation
}
```

Metro will automatically pick the right file!

## Testing Web Bluetooth

### 1. Start Development Server

```bash
pnpm dev:metro
```

### 2. Open in Chrome

```
http://localhost:8081
```

### 3. Test BLE Features

1. Navigate to Connect tab
2. Click "Scan for Devices" button
3. Select device from picker
4. Wait for connection
5. Send test message from Messages tab
6. Verify message appears in chat

### 4. Debugging

Open Chrome DevTools:
- **Console**: View BLE logs `[WebBLE]`
- **Application → Bluetooth**: See connected devices
- **Network**: Monitor WebSocket if using Bridge

## Common Issues

### "Bluetooth not supported"

**Solution**: Use Chrome, Edge, or Opera browser

### "User cancelled device selection"

**Solution**: User closed picker without selecting device. Click "Scan" again.

### "Connection failed"

**Possible causes**:
- Device too far away
- Device already connected to another app
- Bluetooth turned off on computer
- Device not in pairing mode

**Solution**:
1. Move device closer
2. Disconnect from other apps
3. Enable Bluetooth
4. Reset device

### "GATT Server disconnected"

**Possible causes**:
- Device went out of range
- Device powered off
- Connection timeout

**Solution**:
- Click "Scan" and reconnect
- Check device battery
- Move closer to device

## Advanced: HTTPS Setup for Production

### Using Cloudflare Tunnel (Free)

```bash
# Install cloudflared
# Download from: https://github.com/cloudflare/cloudflared

# Create tunnel
cloudflared tunnel create meshcore-web

# Configure tunnel
# Edit ~/.cloudflared/config.yml:
tunnel: <TUNNEL_ID>
credentials-file: /path/to/<TUNNEL_ID>.json

ingress:
  - hostname: meshcore.yourdomain.com
    service: http://localhost:8081
  - service: http_status:404

# Run tunnel
cloudflared tunnel run meshcore-web
```

Now accessible at: https://meshcore.yourdomain.com (with valid SSL)

### Using Let's Encrypt (Self-Hosted)

```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d meshcore.yourdomain.com

# Configure nginx (see Security Considerations section above)
```

## Feature Parity Matrix

| Feature | Native App | Web App |
|---------|-----------|---------|
| BLE Scanning | ✅ Background | ⚠️ User-initiated |
| BLE Connection | ✅ Auto | ✅ Manual |
| Send Messages | ✅ | ✅ |
| Receive Messages | ✅ | ✅ |
| RSSI Display | ✅ | ❌ |
| Node Telemetry | ✅ | ✅ |
| GPS/Map | ✅ Native | ⚠️ Web maps |
| Offline Queue | ✅ | ✅ |
| File Sharing | ✅ | ✅ |
| Encryption | ✅ | ✅ |
| Background Operation | ✅ | ❌ |
| Push Notifications | ✅ | ⚠️ Web push |

## Best Practices

### 1. Always Use HTTPS in Production

```javascript
// Check if secure context
if (!window.isSecureContext) {
  console.error('Web Bluetooth requires HTTPS');
}
```

### 2. Handle User Cancellation

```javascript
try {
  await bleService.startScan(onDevice);
} catch (error) {
  if (error.name === 'NotFoundError') {
    // User cancelled - show friendly message
    alert('Please select a device to connect');
  }
}
```

### 3. Reconnection Handling

Web Bluetooth doesn't auto-reconnect. Monitor connection state:

```javascript
device.addEventListener('gattserverdisconnected', () => {
  console.log('Device disconnected');
  // Show reconnect button
});
```

## Limitations to Communicate to Users

When deploying the web app, inform users:

1. **Browser Required**: Chrome, Edge, or Opera only
2. **HTTPS Required**: Must access via HTTPS (not HTTP)
3. **User Interaction**: Must click button to scan (security feature)
4. **No Background**: Tab must stay open
5. **No Auto-Reconnect**: May need to manually reconnect
6. **Limited RSSI**: Signal strength not available

## Deployment Checklist for Web

- [ ] Build web version: `npx expo export:web`
- [ ] Deploy to web server with HTTPS
- [ ] Test in Chrome browser
- [ ] Test device scanning and connection
- [ ] Test message send/receive
- [ ] Add browser compatibility notice
- [ ] Document HTTPS requirement
- [ ] Provide troubleshooting guide

## Advantages of Web Bluetooth

### For Users
✅ No app installation required  
✅ Works on desktop computers  
✅ Instant updates (no app store approval)  
✅ Cross-platform (Windows, macOS, Linux, Android)  
✅ Easier for quick testing

### For Developers
✅ Faster iteration (no rebuild needed)  
✅ Easier debugging (Chrome DevTools)  
✅ Same codebase as mobile  
✅ No app store submission for updates

## Demo

Try it now:

```bash
cd MeshCore-Mobile
pnpm dev:metro
```

Open Chrome → http://localhost:8081 → Connect tab → Scan for Devices

---

**Result**: Your mesh device works directly in the browser! 🎉
