import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { getWebSocketService, initWebSocketService, type WebSocketMessage } from "@/lib/websocket-service";

// Default backend URL - update this to match your Django backend
const DEFAULT_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  
  // Use useRef to store callbacks to prevent re-subscription on every render
  const connectedRef = useRef(connected);
  const messagesRef = useRef(messages);
  
  // Update refs when state changes
  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);
  
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  // Use useMemo to ensure wsService is only created once
  const wsService = useMemo(() => {
    try {
      return getWebSocketService(DEFAULT_BACKEND_URL);
    } catch {
      return initWebSocketService(DEFAULT_BACKEND_URL);
    }
  }, []);

  // Connect on mount - only run once
  useEffect(() => {
    // Set initial connection state
    setConnected(wsService.isConnected());
    
    // Connect if not already connected
    if (!wsService.isConnected()) {
      wsService.connect();
    }

    // Subscribe to connection state changes with stable callback
    const unsubscribeConnection = wsService.onConnectionChange((isConnected) => {
      // Only update if state actually changed
      if (connectedRef.current !== isConnected) {
        setConnected(isConnected);
      }
    });

    // Subscribe to messages with stable callback
    const unsubscribeMessages = wsService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
      // Don't disconnect here - keep connection alive across component unmounts
    };
  }, []); // Empty deps - only run once on mount

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
