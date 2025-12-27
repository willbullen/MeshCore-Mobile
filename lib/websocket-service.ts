/**
 * WebSocket Service for real-time communication with Django backend
 * Handles message sync, node updates, and telemetry data
 */

export type WebSocketMessage = {
  type: "message" | "node_update" | "telemetry" | "ping" | "pong";
  data: any;
  timestamp?: number;
};

export type MessageReceivedCallback = (message: WebSocketMessage) => void;
export type ConnectionStateCallback = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private messageCallbacks: MessageReceivedCallback[] = [];
  private connectionCallbacks: ConnectionStateCallback[] = [];
  private isConnecting = false;

  constructor(backendUrl: string) {
    // Convert HTTP URL to WebSocket URL
    this.url = backendUrl.replace(/^http/, "ws") + "/ws/mesh/";
  }

  /**
   * Connect to WebSocket server
   */
  async connect(authToken?: string): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("[WS] Already connected");
      return;
    }

    if (this.isConnecting) {
      console.log("[WS] Connection already in progress");
      return;
    }

    this.isConnecting = true;

    try {
      // Add auth token to URL if provided
      const wsUrl = authToken ? `${this.url}?token=${authToken}` : this.url;
      
      console.log("[WS] Connecting to:", wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("[WS] Connected successfully");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.notifyConnectionState(true);
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle ping/pong internally
          if (message.type === "ping") {
            this.send({ type: "pong", data: {} });
            return;
          }

          // Notify all callbacks
          this.messageCallbacks.forEach((callback) => callback(message));
        } catch (error) {
          console.error("[WS] Failed to parse message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("[WS] Error:", error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log("[WS] Connection closed");
        this.isConnecting = false;
        this.notifyConnectionState(false);
        this.stopPingInterval();
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error("[WS] Failed to create WebSocket:", error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopPingInterval();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.notifyConnectionState(false);
  }

  /**
   * Send message to server
   */
  send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[WS] Cannot send message: not connected");
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("[WS] Failed to send message:", error);
      return false;
    }
  }

  /**
   * Send a mesh message
   */
  sendMessage(to: string, text: string, channel: number = 0): boolean {
    return this.send({
      type: "message",
      data: {
        to,
        text,
        channel,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Request node updates
   */
  requestNodeUpdates(): boolean {
    return this.send({
      type: "node_update",
      data: { action: "request_all" },
    });
  }

  /**
   * Send telemetry data
   */
  sendTelemetry(nodeId: string, telemetry: any): boolean {
    return this.send({
      type: "telemetry",
      data: {
        nodeId,
        ...telemetry,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Subscribe to messages
   */
  onMessage(callback: MessageReceivedCallback): () => void {
    this.messageCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.messageCallbacks.indexOf(callback);
      if (index > -1) {
        this.messageCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionChange(callback: ConnectionStateCallback): () => void {
    this.connectionCallbacks.push(callback);
    
    // Don't immediately notify - let the hook set initial state
    // This prevents infinite re-render loops
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[WS] Max reconnect attempts reached");
      return;
    }

    if (this.reconnectTimer) {
      return; // Already scheduled
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval(): void {
    this.stopPingInterval();
    
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: "ping", data: {} });
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Notify all connection state callbacks
   */
  private notifyConnectionState(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(connected));
  }
}

// Singleton instance
let wsService: WebSocketService | null = null;

/**
 * Get or create WebSocket service instance
 */
export function getWebSocketService(backendUrl?: string): WebSocketService {
  if (!wsService && backendUrl) {
    wsService = new WebSocketService(backendUrl);
  }
  
  if (!wsService) {
    throw new Error("WebSocket service not initialized. Provide backendUrl on first call.");
  }
  
  return wsService;
}

/**
 * Initialize WebSocket service with backend URL
 */
export function initWebSocketService(backendUrl: string): WebSocketService {
  wsService = new WebSocketService(backendUrl);
  return wsService;
}
