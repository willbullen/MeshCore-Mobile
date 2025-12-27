/**
 * Mock data for MeshCore mobile app UI prototype
 */

export type NodeType = 'chat' | 'repeater' | 'room_server' | 'sensor' | 'companion';
export type MessageType = 'txt_msg' | 'grp_txt';
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'failed';
export type ChannelRole = 'primary' | 'secondary' | 'disabled';

export interface Node {
  nodeHash: string;
  name: string;
  nodeType: NodeType;
  isOnline: boolean;
  lastSeen: Date;
  latitude?: number;
  longitude?: number;
  batteryLevel?: number;
  rssi?: number;
  snr?: number;
}

export interface Message {
  id: string;
  sender: Node;
  recipient?: Node;
  channel?: Channel;
  content: string;
  messageType: MessageType;
  timestamp: Date;
  status: MessageStatus;
}

export interface Channel {
  channelHash: string;
  name: string;
  role: ChannelRole;
  psk: string;
}

export interface Conversation {
  node: Node;
  lastMessage: Message;
  unreadCount: number;
}

// Mock Nodes
export const mockNodes: Node[] = [
  {
    nodeHash: "a1b2c3d4",
    name: "Base Station",
    nodeType: "repeater",
    isOnline: true,
    lastSeen: new Date(),
    latitude: 37.7749,
    longitude: -122.4194,
    batteryLevel: 100,
    rssi: -45,
    snr: 12.5,
  },
  {
    nodeHash: "e5f6g7h8",
    name: "Mobile Alpha",
    nodeType: "chat",
    isOnline: true,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    latitude: 37.7750,
    longitude: -122.4180,
    batteryLevel: 75,
    rssi: -68,
    snr: 8.2,
  },
  {
    nodeHash: "i9j0k1l2",
    name: "Mobile Bravo",
    nodeType: "chat",
    isOnline: false,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    latitude: 37.7730,
    longitude: -122.4220,
    batteryLevel: 45,
    rssi: -85,
    snr: 3.1,
  },
  {
    nodeHash: "m3n4o5p6",
    name: "Weather Sensor",
    nodeType: "sensor",
    isOnline: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    latitude: 37.7760,
    longitude: -122.4170,
    batteryLevel: 90,
    rssi: -52,
    snr: 10.8,
  },
  {
    nodeHash: "q7r8s9t0",
    name: "Companion Device",
    nodeType: "companion",
    isOnline: true,
    lastSeen: new Date(),
    latitude: 37.7745,
    longitude: -122.4200,
    batteryLevel: 60,
    rssi: -72,
    snr: 6.5,
  },
];

// Mock Channels
export const mockChannels: Channel[] = [
  {
    channelHash: "ch_primary",
    name: "LongFast",
    role: "primary",
    psk: "AQ==",
  },
  {
    channelHash: "ch_secondary",
    name: "MediumSlow",
    role: "secondary",
    psk: "AQ==",
  },
  {
    channelHash: "ch_admin",
    name: "ShortSlow",
    role: "disabled",
    psk: "AQ==",
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "msg_001",
    sender: mockNodes[1], // Mobile Alpha
    content: "Hey, are you at the base station?",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_002",
    sender: mockNodes[0], // Base Station (me)
    recipient: mockNodes[1],
    content: "Yes, just arrived. Signal is strong here.",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 9 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_003",
    sender: mockNodes[1],
    content: "Great! I'm heading your way.",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_004",
    sender: mockNodes[0],
    recipient: mockNodes[1],
    content: "See you soon!",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_005",
    sender: mockNodes[2], // Mobile Bravo
    content: "Anyone copy? My battery is getting low.",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_006",
    sender: mockNodes[0],
    recipient: mockNodes[2],
    content: "I copy. Head to the nearest charging point.",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 48 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_007",
    sender: mockNodes[2],
    content: "Roger that. Going offline to conserve power.",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 46 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_008",
    sender: mockNodes[3], // Weather Sensor
    content: "Temperature: 72°F, Humidity: 65%",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[1],
  },
  {
    id: "msg_009",
    sender: mockNodes[4], // Companion Device
    content: "System check: All systems operational",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_010",
    sender: mockNodes[0],
    content: "Testing mesh network connectivity...",
    messageType: "grp_txt",
    timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_011",
    sender: mockNodes[1],
    content: "Signal received loud and clear!",
    messageType: "grp_txt",
    timestamp: new Date(Date.now() - 119 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_012",
    sender: mockNodes[0],
    recipient: mockNodes[4],
    content: "Can you relay this to Mobile Bravo?",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_013",
    sender: mockNodes[4],
    content: "Message relayed successfully",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 59 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_014",
    sender: mockNodes[0],
    content: "Network status: 5 nodes online",
    messageType: "grp_txt",
    timestamp: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_015",
    sender: mockNodes[1],
    content: "Received position update from base",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_016",
    sender: mockNodes[0],
    recipient: mockNodes[3],
    content: "Request telemetry data",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[1],
  },
  {
    id: "msg_017",
    sender: mockNodes[3],
    content: "Telemetry data sent",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 24 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[1],
  },
  {
    id: "msg_018",
    sender: mockNodes[0],
    content: "Good morning mesh network!",
    messageType: "grp_txt",
    timestamp: new Date(Date.now() - 360 * 60 * 1000), // 6 hours ago
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_019",
    sender: mockNodes[1],
    content: "Morning! Ready for today's operations.",
    messageType: "grp_txt",
    timestamp: new Date(Date.now() - 358 * 60 * 1000),
    status: "delivered",
    channel: mockChannels[0],
  },
  {
    id: "msg_020",
    sender: mockNodes[0],
    recipient: mockNodes[1],
    content: "Let's sync up at 1400 hours",
    messageType: "txt_msg",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "sent",
    channel: mockChannels[0],
  },
];

// Mock Conversations (derived from messages)
export const mockConversations: Conversation[] = [
  {
    node: mockNodes[1], // Mobile Alpha
    lastMessage: mockMessages[19], // Most recent message
    unreadCount: 1,
  },
  {
    node: mockNodes[2], // Mobile Bravo
    lastMessage: mockMessages[6],
    unreadCount: 0,
  },
  {
    node: mockNodes[4], // Companion Device
    lastMessage: mockMessages[12],
    unreadCount: 0,
  },
  {
    node: mockNodes[3], // Weather Sensor
    lastMessage: mockMessages[16],
    unreadCount: 2,
  },
];

// Helper function to get messages for a specific node
export function getMessagesForNode(nodeHash: string): Message[] {
  return mockMessages.filter(
    (msg) =>
      msg.sender.nodeHash === nodeHash ||
      msg.recipient?.nodeHash === nodeHash
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Helper function to get messages for a specific channel
export function getMessagesForChannel(channelHash: string): Message[] {
  return mockMessages.filter(
    (msg) => msg.channel?.channelHash === channelHash
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Helper function to format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Helper function to get node type icon name
export function getNodeTypeIcon(nodeType: NodeType): string {
  switch (nodeType) {
    case "chat":
      return "person.fill";
    case "repeater":
      return "antenna.radiowaves.left.and.right";
    case "room_server":
      return "server.rack";
    case "sensor":
      return "sensor.fill";
    case "companion":
      return "iphone";
    default:
      return "questionmark.circle.fill";
  }
}

// Helper function to get status color
export function getStatusColor(isOnline: boolean): string {
  return isOnline ? "#22c55e" : "#64748b";
}

// Helper function to get battery color
export function getBatteryColor(level?: number): string {
  if (!level) return "#64748b";
  if (level > 60) return "#22c55e";
  if (level > 20) return "#f59e0b";
  return "#ef4444";
}

// Helper function to get signal strength label
export function getSignalStrength(rssi?: number): string {
  if (!rssi) return "Unknown";
  if (rssi > -50) return "Excellent";
  if (rssi > -70) return "Good";
  if (rssi > -85) return "Fair";
  return "Poor";
}
