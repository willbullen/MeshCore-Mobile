import axios, { AxiosInstance, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api" // Development (use your Django server URL)
  : "https://your-production-api.com/api"; // Production

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  
  // Nodes
  NODES_LIST: "/nodes",
  NODES_DETAIL: (nodeHash: string) => `/nodes/${nodeHash}`,
  NODES_TELEMETRY: (nodeHash: string) => `/nodes/${nodeHash}/telemetry`,
  
  // Messages
  MESSAGES_LIST: "/messages",
  MESSAGES_SEND: "/messages",
  MESSAGES_CONVERSATION: (nodeHash: string) => `/messages/conversation/${nodeHash}`,
  
  // Channels
  CHANNELS_LIST: "/channels",
  CHANNELS_DETAIL: (channelHash: string) => `/channels/${channelHash}`,
};

// Storage keys
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

class APIService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.authToken) {
          this.authToken = await AsyncStorage.getItem(TOKEN_KEY);
        }
        
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
              const response = await this.client.post(API_ENDPOINTS.AUTH_REFRESH, {
                refreshToken,
              });

              const { token } = response.data;
              await this.setAuthToken(token);

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            await this.clearAuth();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async setAuthToken(token: string, refreshToken?: string) {
    this.authToken = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  async clearAuth() {
    this.authToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async getAuthToken(): Promise<string | null> {
    if (!this.authToken) {
      this.authToken = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.authToken;
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Node API methods
  async getNodes() {
    return this.get<any[]>(API_ENDPOINTS.NODES_LIST);
  }

  async getNodeDetail(nodeHash: string) {
    return this.get<any>(API_ENDPOINTS.NODES_DETAIL(nodeHash));
  }

  async getNodeTelemetry(nodeHash: string, params?: { start?: string; end?: string }) {
    return this.get<any[]>(API_ENDPOINTS.NODES_TELEMETRY(nodeHash), params);
  }

  // Message API methods
  async getMessages(params?: { limit?: number; offset?: number }) {
    return this.get<any[]>(API_ENDPOINTS.MESSAGES_LIST, params);
  }

  async sendMessage(data: {
    to: string;
    content: string;
    channel?: string;
    messageType?: string;
  }) {
    return this.post<any>(API_ENDPOINTS.MESSAGES_SEND, data);
  }

  async getConversation(nodeHash: string, params?: { limit?: number; offset?: number }) {
    return this.get<any[]>(API_ENDPOINTS.MESSAGES_CONVERSATION(nodeHash), params);
  }

  // Channel API methods
  async getChannels() {
    return this.get<any[]>(API_ENDPOINTS.CHANNELS_LIST);
  }

  async getChannelDetail(channelHash: string) {
    return this.get<any>(API_ENDPOINTS.CHANNELS_DETAIL(channelHash));
  }
}

// Singleton instance
export const apiService = new APIService();
