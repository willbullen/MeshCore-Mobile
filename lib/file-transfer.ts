/**
 * File Transfer Service
 * 
 * Handles splitting large files into chunks for transmission over BLE,
 * and reassembling received chunks back into complete files.
 */

import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// MTU size for BLE (512 bytes - overhead)
const CHUNK_SIZE = 480; // Leave room for packet headers

// New packet types for file transfer
export enum FilePacketType {
  FILE_START = 0x10,
  FILE_CHUNK = 0x11,
  FILE_END = 0x12,
  FILE_ACK = 0x13,
}

export interface FileMetadata {
  fileId: string;
  fileName: string;
  fileType: 'image' | 'audio' | 'file';
  mimeType: string;
  totalSize: number;
  totalChunks: number;
  checksum: string;
}

export interface FileChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  data: Uint8Array;
}

export interface FileTransferProgress {
  fileId: string;
  fileName: string;
  transferred: number;
  total: number;
  percentage: number;
  status: 'preparing' | 'sending' | 'receiving' | 'complete' | 'failed';
}

class FileTransferService {
  private activeTransfers = new Map<string, FileTransferProgress>();
  private receivedChunks = new Map<string, Map<number, Uint8Array>>();
  private progressCallbacks = new Map<string, (progress: FileTransferProgress) => void>();

  /**
   * Prepare file for transfer (compress if image)
   */
  async prepareFile(
    uri: string,
    fileType: 'image' | 'audio' | 'file'
  ): Promise<{ uri: string; size: number; mimeType: string }> {
    try {
      if (fileType === 'image') {
        // Compress image
        const compressed = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }], // Resize to max 1024px width
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const fileInfo = await FileSystem.getInfoAsync(compressed.uri);
        if (!fileInfo.exists) {
          throw new Error('Compressed file not found');
        }

        return {
          uri: compressed.uri,
          size: fileInfo.size || 0,
          mimeType: 'image/jpeg',
        };
      }

      // For other file types, use as-is
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File not found');
      }

      return {
        uri,
        size: fileInfo.size || 0,
        mimeType: fileType === 'audio' ? 'audio/mpeg' : 'application/octet-stream',
      };
    } catch (error) {
      console.error('[FileTransfer] Error preparing file:', error);
      throw error;
    }
  }

  /**
   * Split file into chunks
   */
  async splitFile(uri: string, fileType: 'image' | 'audio' | 'file'): Promise<{
    metadata: FileMetadata;
    chunks: FileChunk[];
  }> {
    try {
      // Prepare file (compress if image)
      const { uri: preparedUri, size, mimeType } = await this.prepareFile(uri, fileType);

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(preparedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBuffer = Buffer.from(base64Data, 'base64');
      
      // Calculate checksum (simple hash)
      const checksum = this.calculateChecksum(fileBuffer);
      
      // Generate file ID
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Split into chunks
      const chunks: FileChunk[] = [];
      const totalChunks = Math.ceil(fileBuffer.length / CHUNK_SIZE);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileBuffer.length);
        const chunkData = fileBuffer.slice(start, end);
        
        chunks.push({
          fileId,
          chunkIndex: i,
          totalChunks,
          data: new Uint8Array(chunkData),
        });
      }
      
      const metadata: FileMetadata = {
        fileId,
        fileName: uri.split('/').pop() || 'file',
        fileType,
        mimeType,
        totalSize: fileBuffer.length,
        totalChunks,
        checksum,
      };
      
      console.log(`[FileTransfer] File split into ${totalChunks} chunks`);
      
      return { metadata, chunks };
    } catch (error) {
      console.error('[FileTransfer] Error splitting file:', error);
      throw error;
    }
  }

  /**
   * Calculate simple checksum
   */
  private calculateChecksum(data: Buffer): string {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum = (sum + data[i]) % 65536;
    }
    return sum.toString(16).padStart(4, '0');
  }

  /**
   * Verify checksum
   */
  private verifyChecksum(data: Buffer, expectedChecksum: string): boolean {
    const actualChecksum = this.calculateChecksum(data);
    return actualChecksum === expectedChecksum;
  }

  /**
   * Encode FILE_START packet
   */
  encodeFileStart(metadata: FileMetadata): string {
    const packet = {
      type: FilePacketType.FILE_START,
      metadata,
      timestamp: Date.now(),
    };
    
    return Buffer.from(JSON.stringify(packet)).toString('base64');
  }

  /**
   * Encode FILE_CHUNK packet
   */
  encodeFileChunk(chunk: FileChunk): string {
    const packet = {
      type: FilePacketType.FILE_CHUNK,
      fileId: chunk.fileId,
      chunkIndex: chunk.chunkIndex,
      totalChunks: chunk.totalChunks,
      data: Buffer.from(chunk.data).toString('base64'),
    };
    
    return Buffer.from(JSON.stringify(packet)).toString('base64');
  }

  /**
   * Encode FILE_END packet
   */
  encodeFileEnd(fileId: string, checksum: string): string {
    const packet = {
      type: FilePacketType.FILE_END,
      fileId,
      checksum,
      timestamp: Date.now(),
    };
    
    return Buffer.from(JSON.stringify(packet)).toString('base64');
  }

  /**
   * Encode FILE_ACK packet
   */
  encodeFileAck(fileId: string, success: boolean, missingChunks?: number[]): string {
    const packet = {
      type: FilePacketType.FILE_ACK,
      fileId,
      success,
      missingChunks,
      timestamp: Date.now(),
    };
    
    return Buffer.from(JSON.stringify(packet)).toString('base64');
  }

  /**
   * Process received chunk
   */
  async processChunk(fileId: string, chunkIndex: number, chunkData: Uint8Array, totalChunks: number): Promise<void> {
    try {
      // Get or create chunks map for this file
      if (!this.receivedChunks.has(fileId)) {
        this.receivedChunks.set(fileId, new Map());
      }
      
      const chunks = this.receivedChunks.get(fileId)!;
      chunks.set(chunkIndex, chunkData);
      
      // Update progress
      const progress: FileTransferProgress = {
        fileId,
        fileName: 'received-file',
        transferred: chunks.size,
        total: totalChunks,
        percentage: Math.round((chunks.size / totalChunks) * 100),
        status: chunks.size === totalChunks ? 'complete' : 'receiving',
      };
      
      this.updateProgress(fileId, progress);
      
      console.log(`[FileTransfer] Received chunk ${chunkIndex + 1}/${totalChunks} for ${fileId}`);
      
      // Check if all chunks received
      if (chunks.size === totalChunks) {
        await this.assembleFile(fileId, chunks, totalChunks);
      }
    } catch (error) {
      console.error('[FileTransfer] Error processing chunk:', error);
      this.updateProgress(fileId, {
        fileId,
        fileName: 'received-file',
        transferred: 0,
        total: totalChunks,
        percentage: 0,
        status: 'failed',
      });
      throw error;
    }
  }

  /**
   * Assemble file from chunks
   */
  private async assembleFile(
    fileId: string,
    chunks: Map<number, Uint8Array>,
    totalChunks: number
  ): Promise<string> {
    try {
      // Sort chunks by index
      const sortedChunks: Uint8Array[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks.get(i);
        if (!chunk) {
          throw new Error(`Missing chunk ${i}`);
        }
        sortedChunks.push(chunk);
      }
      
      // Concatenate all chunks
      const totalSize = sortedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const fileBuffer = new Uint8Array(totalSize);
      
      let offset = 0;
      for (const chunk of sortedChunks) {
        fileBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Save to file system
      const fileName = `${fileId}.dat`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      const base64Data = Buffer.from(fileBuffer).toString('base64');
      
      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Clean up chunks
      this.receivedChunks.delete(fileId);
      
      console.log('[FileTransfer] File assembled:', filePath);
      return filePath;
    } catch (error) {
      console.error('[FileTransfer] Error assembling file:', error);
      throw error;
    }
  }

  /**
   * Update transfer progress
   */
  private updateProgress(fileId: string, progress: FileTransferProgress): void {
    this.activeTransfers.set(fileId, progress);
    
    const callback = this.progressCallbacks.get(fileId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Subscribe to transfer progress
   */
  onProgress(fileId: string, callback: (progress: FileTransferProgress) => void): () => void {
    this.progressCallbacks.set(fileId, callback);
    
    // Send current progress if available
    const current = this.activeTransfers.get(fileId);
    if (current) {
      callback(current);
    }
    
    return () => {
      this.progressCallbacks.delete(fileId);
    };
  }

  /**
   * Cancel file transfer
   */
  async cancelTransfer(fileId: string): Promise<void> {
    try {
      this.activeTransfers.delete(fileId);
      this.receivedChunks.delete(fileId);
      this.progressCallbacks.delete(fileId);
      
      console.log('[FileTransfer] Transfer cancelled:', fileId);
    } catch (error) {
      console.error('[FileTransfer] Error cancelling transfer:', error);
      throw error;
    }
  }

  /**
   * Get active transfers
   */
  getActiveTransfers(): FileTransferProgress[] {
    return Array.from(this.activeTransfers.values());
  }
}

// Singleton instance
export const fileTransfer = new FileTransferService();
