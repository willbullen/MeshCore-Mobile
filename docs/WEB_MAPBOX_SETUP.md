# Web Mapbox Setup Guide

## Overview

MeshCore Mobile uses **Mapbox GL JS** for interactive maps when running in a web browser. This provides the same map experience as the native apps, with markers, popups, and navigation controls.

## Features

### ✅ What Works on Web
- Interactive pan and zoom
- Node markers with color coding (green = online, gray = offline)
- Popup info when clicking markers
- Navigation controls (zoom, rotate)
- Fullscreen mode
- Dark theme map style
- Click to open in Google/Apple Maps

### 🎨 Map Customization
- Dark theme by default (`mapbox://styles/mapbox/dark-v11`)
- Custom node markers with status colors
- Popup with node name, type, and coordinates
- Automatic bounds fitting for all nodes

## Setup

### 1. Get Mapbox Access Token (Free)

**Option A: Use Default Token (Development)**

The app includes a public Mapbox token for development/testing. This works out of the box but has usage limits.

**Option B: Get Your Own Token (Recommended for Production)**

1. Create account at [mapbox.com](https://account.mapbox.com/)
2. Go to [Access Tokens](https://account.mapbox.com/access-tokens/)
3. Copy your "Default public token"
4. Add to your `.env` file:

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG...
```

### 2. Install Dependencies (Already Added)

The required dependencies are already in `package.json`:

```json
{
  "dependencies": {
    "react-native-maps": "1.20.1"
  }
}
```

No additional web dependencies needed - Mapbox GL JS loads from CDN!

### 3. Run Web Server

```bash
pnpm dev:metro
```

Opens at: http://localhost:8081

## Usage

### Display Map

The map automatically loads when you navigate to the Map tab:

1. Start app: `pnpm dev:metro`
2. Open http://localhost:8081 in Chrome
3. Click "Map" tab
4. Map loads with Mapbox

### View Nodes

- **Green markers** = Online nodes
- **Gray markers** = Offline nodes
- Click marker to see popup with:
  - Node name
  - Node type
  - Online status
  - GPS coordinates
- Click inside popup to open in Google/Apple Maps

### Navigation Controls

**Top-right corner**:
- **+/−** buttons: Zoom in/out
- **Compass**: Reset bearing
- **Fullscreen**: Expand map to full screen
- **Ctrl + scroll**: Zoom
- **Click + drag**: Pan map
- **Right-click + drag**: Rotate map

## Map Styles

### Available Styles

Change map style in [`components/native-map-view.web.tsx`](components/native-map-view.web.tsx):

```typescript
// Dark (default)
style: 'mapbox://styles/mapbox/dark-v11'

// Light
style: 'mapbox://styles/mapbox/light-v11'

// Streets
style: 'mapbox://styles/mapbox/streets-v12'

// Satellite
style: 'mapbox://styles/mapbox/satellite-streets-v12'

// Outdoors (great for hiking!)
style: 'mapbox://styles/mapbox/outdoors-v12'
```

### Custom Style

Create custom map style in [Mapbox Studio](https://studio.mapbox.com/):

1. Create custom style
2. Publish style
3. Copy style URL
4. Update code:

```typescript
style: 'mapbox://styles/your-username/your-style-id'
```

## Advanced Features

### 1. Add Heatmap Layer

Show node density with heatmap:

```typescript
map.current.addLayer({
  id: 'node-heatmap',
  type: 'heatmap',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: nodes.map(node => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [node.longitude, node.latitude]
        }
      }))
    }
  },
  paint: {
    'heatmap-weight': 1,
    'heatmap-intensity': 1,
    'heatmap-radius': 20,
  }
});
```

### 2. Draw Connection Lines

Show mesh network topology:

```typescript
map.current.addLayer({
  id: 'node-connections',
  type: 'line',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: connections.map(conn => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [conn.from.longitude, conn.from.latitude],
            [conn.to.longitude, conn.to.latitude]
          ]
        }
      }))
    }
  },
  paint: {
    'line-color': colors.success,
    'line-width': 2,
    'line-opacity': 0.6,
  }
});
```

### 3. Add Clustering

Group nearby nodes at low zoom levels:

```typescript
map.current.addSource('nodes', {
  type: 'geojson',
  data: nodesGeoJSON,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50
});

map.current.addLayer({
  id: 'clusters',
  type: 'circle',
  source: 'nodes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': colors.primary,
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20, // 20px when count < 10
      10, 30, // 30px when count >= 10
      30, 40  // 40px when count >= 30
    ]
  }
});
```

## Troubleshooting

### Map Not Loading

**Check browser console for errors**:

```javascript
// Open DevTools (F12)
// Look for errors like:
// - "Failed to load Mapbox GL JS"
// - "Invalid access token"
// - "Network error"
```

**Solutions**:
1. Check internet connection (Mapbox loads from CDN)
2. Verify access token is valid
3. Check browser console for specific errors
4. Try clearing browser cache

### Markers Not Showing

**Possible causes**:
- Nodes don't have GPS coordinates
- Coordinates are invalid (lat: -90 to 90, lng: -180 to 180)
- Map not fully initialized

**Solution**:
```javascript
// Check node data
console.log('Nodes with location:', nodes);

// Verify coordinates
nodes.forEach(node => {
  console.log(node.name, node.latitude, node.longitude);
});
```

### Access Token Errors

```
Error: An API access token is required
```

**Solution**: Set your Mapbox token in `.env`:

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your-token-here
```

### CORS Errors

If loading tiles fails due to CORS:

**Solution**: Mapbox handles CORS automatically. If you see CORS errors, it's likely a network/firewall issue.

## Performance Optimization

### Reduce Tile Requests

```typescript
// Set max bounds to limit tile loading
map.current.setMaxBounds([
  [minLng, minLat], // Southwest coordinates
  [maxLng, maxLat]  // Northeast coordinates
]);
```

### Lazy Load Map

Only load map when tab is visible:

```typescript
// In map.tsx
const [isTabFocused, setIsTabFocused] = useState(false);

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    setIsTabFocused(true);
  });
  return unsubscribe;
}, [navigation]);
```

### Optimize Marker Updates

Use GeoJSON source instead of individual markers for better performance with many nodes:

```typescript
map.current.addSource('nodes', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: nodes.map(node => ({
      type: 'Feature',
      properties: {
        name: node.name,
        isOnline: node.isOnline,
      },
      geometry: {
        type: 'Point',
        coordinates: [node.longitude, node.latitude]
      }
    }))
  }
});
```

## Comparison: Native vs Web Maps

| Feature | Native (react-native-maps) | Web (Mapbox GL JS) |
|---------|---------------------------|-------------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gestures | Native touch | Mouse/touch |
| Offline | Cached tiles | Cached in browser |
| 3D Buildings | ✅ | ✅ |
| Custom Styles | ✅ | ✅ |
| Clustering | ✅ | ✅ |
| Heatmaps | ✅ | ✅ |
| Setup | Google/Apple API keys | Mapbox token |

## Mapbox Free Tier

Mapbox offers generous free tier:

- **50,000 free map loads/month**
- **Unlimited offline downloads**
- **Unlimited static maps**
- **No credit card required** for development

Perfect for testing and small-scale deployment!

## Alternative: OpenStreetMap with Leaflet

If you prefer an open-source solution without API tokens:

### Using Leaflet

```bash
# Install Leaflet
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// In component
<MapContainer
  center={[initialRegion.latitude, initialRegion.longitude]}
  zoom={13}
  style={{ height: '100%', width: '100%' }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap contributors'
  />
  {nodes.map(node => (
    <Marker key={node.nodeHash} position={[node.latitude, node.longitude]}>
      <Popup>
        <strong>{node.name}</strong><br/>
        {node.nodeType} • {node.isOnline ? 'Online' : 'Offline'}
      </Popup>
    </Marker>
  ))}
</MapContainer>
```

**Pros**:
- No API token needed
- Open source
- Free forever

**Cons**:
- Less features than Mapbox
- Slower performance with many markers
- Fewer styling options

## Production Deployment

### 1. Get Mapbox Token

Create account → Get token → Add to `.env`:

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your-actual-token-here
```

### 2. Set Token Restrictions

In Mapbox dashboard:
- Restrict to your domain: `https://yourdomain.com/*`
- Set HTTP referrer restrictions
- Monitor usage

### 3. Deploy

```bash
# Build for web
npx expo export:web

# Output in web-build/
# Deploy to hosting:
# - Vercel
# - Netlify
# - GitHub Pages
# - Your own server
```

### 4. Configure HTTPS

Web Bluetooth + Mapbox both require HTTPS in production.

## Example: Full Feature Implementation

Here's how to add network topology visualization:

```typescript
// Calculate connections between nodes (example)
const connections = nodes.flatMap((node, i) => 
  nodes.slice(i + 1).map(otherNode => ({
    from: node,
    to: otherNode,
    distance: calculateDistance(node, otherNode)
  }))
).filter(conn => conn.distance < 10); // Only show connections < 10km

// Add to map
map.current.addLayer({
  id: 'connections',
  type: 'line',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: connections.map(conn => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [conn.from.longitude, conn.from.latitude],
            [conn.to.longitude, conn.to.latitude]
          ]
        }
      }))
    }
  },
  paint: {
    'line-color': '#3b82f6',
    'line-width': 2,
  }
});
```

## Summary

✅ **Mapbox is now integrated for web view**  
✅ **Full interactive maps in browser**  
✅ **Same marker functionality as native**  
✅ **No installation required**  
✅ **Works alongside Web Bluetooth**

Your users can now use the **full app in Chrome browser** with:
- Web Bluetooth for device connectivity ✅
- Mapbox for interactive maps ✅
- All messaging and node features ✅

**Result**: Complete mesh networking experience in the browser! 🎉
