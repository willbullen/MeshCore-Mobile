/**
 * Web map implementation using Mapbox GL JS
 * This file is used when building for web
 * Metro will automatically use this instead of .native.tsx on web
 */
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

export interface NativeMapViewProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMapReady: () => void;
  nodes: Array<{
    nodeHash: string;
    name: string;
    latitude: number;
    longitude: number;
    nodeType: string;
    isOnline: boolean;
  }>;
  colors: {
    success: string;
    textDisabled: string;
  };
  onMarkerPress: (latitude: number, longitude: number) => void;
}

export function NativeMapView({
  initialRegion,
  onMapReady,
  nodes,
  colors,
  onMarkerPress,
}: NativeMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    // Only run on web
    if (typeof window === 'undefined') {
      return;
    }

    // Load Mapbox GL JS dynamically
    loadMapbox();
  }, []);

  useEffect(() => {
    // Update markers when nodes change
    if (isLoaded && map.current) {
      updateMarkers();
    }
  }, [nodes, isLoaded]);

  const loadMapbox = async () => {
    try {
      // Check if mapboxgl is already loaded
      if ((window as any).mapboxgl) {
        initializeMap();
        return;
      }

      // Load Mapbox CSS
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Load Mapbox JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
      script.onload = () => {
        initializeMap();
      };
      script.onerror = () => {
        setMapError('Failed to load Mapbox. Using fallback view.');
        onMapReady();
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('[WebMap] Error loading Mapbox:', error);
      setMapError('Map initialization failed');
      onMapReady();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) {
      return;
    }

    const mapboxgl = (window as any).mapboxgl;
    if (!mapboxgl) {
      setMapError('Mapbox not available');
      return;
    }

    try {
      // Use public Mapbox token (or set EXPO_PUBLIC_MAPBOX_TOKEN in .env)
      // For production, get your own token at https://account.mapbox.com/
      mapboxgl.accessToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 
        'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

      // Calculate zoom level from delta
      const zoom = Math.log2(360 / initialRegion.latitudeDelta) - 1;

      // Create map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [initialRegion.longitude, initialRegion.latitude],
        zoom: Math.max(zoom, 1),
      });

      // Add controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.current.on('load', () => {
        console.log('[WebMap] Map loaded');
        setIsLoaded(true);
        onMapReady();
        updateMarkers();
      });

      map.current.on('error', (e: any) => {
        console.error('[WebMap] Map error:', e);
        setMapError('Map error occurred');
      });
    } catch (error) {
      console.error('[WebMap] Error initializing map:', error);
      setMapError('Failed to initialize map');
      onMapReady();
    }
  };

  const updateMarkers = () => {
    if (!map.current || !isLoaded) {
      return;
    }

    const mapboxgl = (window as any).mapboxgl;
    if (!mapboxgl) {
      return;
    }

    // Remove old markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    nodes.forEach(node => {
      try {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = node.isOnline ? colors.success : colors.textDisabled;
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.title = node.name;

        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([node.longitude, node.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 8px;">
                  <strong style="font-size: 14px;">${node.name}</strong><br/>
                  <span style="font-size: 12px; color: #666;">
                    ${node.nodeType} • ${node.isOnline ? '🟢 Online' : '⚪ Offline'}
                  </span><br/>
                  <span style="font-size: 11px; color: #999;">
                    ${node.latitude.toFixed(6)}, ${node.longitude.toFixed(6)}
                  </span>
                </div>
              `)
          )
          .addTo(map.current);

        // Handle marker click
        el.addEventListener('click', () => {
          onMarkerPress(node.latitude, node.longitude);
        });

        markers.current.push(marker);
      } catch (error) {
        console.error('[WebMap] Error adding marker:', error);
      }
    });

    console.log(`[WebMap] Added ${markers.current.length} markers`);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markers.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (mapError) {
    return (
      <View style={styles.error}>
        <p style={{ color: '#ef4444', textAlign: 'center' }}>{mapError}</p>
        <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
          Please check console for details or use the node list below.
        </p>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
