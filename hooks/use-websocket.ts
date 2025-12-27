import { useEffect, useState, useCallback, useMemo } from "react";
import { getWebSocketService, initWebSocketService, type WebSocketMessage } from "@/lib/websocket-service";

// Default backend URL - update this to match your Django backend
const DEFAULT_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  
  // Use useMemo to ensure wsService is only created once
  const wsService = useMemo(() => {
    try {
      return getWebSocketService(DEFAULT_BACKEND_URL);
    } catch {
      return initWebSocketService(DEFAULT_BACKEND_URL);
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    // Set initial connection state
    setConnected(wsService.isConnected());
    
    // Connect if not already connected
    if (!wsService.isConnected()) {
      wsService.connect();
    }

    // Subscribe to connection state changes
    const unsubscribeConnection = wsService.onConnectionChange((isConnected) => {
      setConnected(isConnected);
    });

    // Subscribe to messages
    const unsubscribeMessages = wsService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
      // Don't disconnect here - keep connection alive across component unmounts
    };
  }, [wsService]);

  const sendMessage = useCallback(
    (to: string, text: string, channel?: number) => {
      return wsService.sendMessage(to, text, channel);
    },
    [wsService]
  );

  const requestNodeUpdates = useCallback(() => {
    return wsService.requestNodeUpdates();
  }, [wsService]);

  const sendTelemetry = useCallback(
    (nodeId: string, telemetry: any) => {
      return wsService.sendTelemetry(nodeId, telemetry);
    },
    [wsService]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connected,
    messages,
    sendMessage,
    requestNodeUpdates,
    sendTelemetry,
    clearMessages,
  };
}
