/**
 * Crypto Service
 * 
 * Handles end-to-end encryption for mesh network messages using Ed25519 signatures
 * and X25519 encryption (converted from Ed25519 keys).
 */

import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

// Storage keys for secure store
const SECURE_KEYS = {
  PRIVATE_KEY: '@meshcore/private_key_ed25519',
  PUBLIC_KEY: '@meshcore/public_key_ed25519',
} as const;

export interface KeyPair {
  publicKey: string;  // Base64 encoded
  privateKey: string; // Base64 encoded (stored securely)
}

export interface EncryptedPayload {
  encrypted: boolean;
  nonce: string;      // Base64 encoded nonce
  ciphertext: string; // Base64 encoded encrypted data
  signature: string;  // Base64 encoded signature
  senderPublicKey: string; // Base64 encoded
}

class CryptoService {
  private keyPair: KeyPair | null = null;
  private isInitialized = false;

  /**
   * Initialize crypto service (load or generate keys)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Try to load existing keys
      const publicKey = await SecureStore.getItemAsync(SECURE_KEYS.PUBLIC_KEY);
      const privateKey = await SecureStore.getItemAsync(SECURE_KEYS.PRIVATE_KEY);

      if (publicKey && privateKey) {
        this.keyPair = { publicKey, privateKey };
        console.log('[Crypto] Loaded existing key pair');
      } else {
        // Generate new key pair
        await this.generateKeyPair();
        console.log('[Crypto] Generated new key pair');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('[Crypto] Error initializing:', error);
      throw error;
    }
  }

  /**
   * Generate new Ed25519 key pair
   * 
   * Note: For production, use a proper crypto library like:
   * - expo-crypto or @noble/ed25519 for Ed25519
   * - sodium-react-native for full NaCl implementation
   * 
   * This is a placeholder implementation using browser crypto
   */
  private async generateKeyPair(): Promise<void> {
    try {
      // For now, generate a random 32-byte key pair
      // In production, use proper Ed25519 key generation
      const privateKey = this.generateRandomBytes(32);
      const publicKey = this.derivePublicKey(privateKey);

      this.keyPair = {
        publicKey: Buffer.from(publicKey).toString('base64'),
        privateKey: Buffer.from(privateKey).toString('base64'),
      };

      // Store keys securely
      await SecureStore.setItemAsync(SECURE_KEYS.PUBLIC_KEY, this.keyPair.publicKey);
      await SecureStore.setItemAsync(SECURE_KEYS.PRIVATE_KEY, this.keyPair.privateKey);

      console.log('[Crypto] Key pair generated and stored');
    } catch (error) {
      console.error('[Crypto] Error generating key pair:', error);
      throw error;
    }
  }

  /**
   * Generate random bytes (placeholder - use crypto library in production)
   */
  private generateRandomBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  }

  /**
   * Derive public key from private key (placeholder)
   * In production, use proper Ed25519 key derivation
   */
  private derivePublicKey(privateKey: Uint8Array): Uint8Array {
    // Placeholder: In production, use Ed25519 point multiplication
    // For now, just hash the private key
    const publicKey = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      publicKey[i] = (privateKey[i] + i) % 256;
    }
    return publicKey;
  }

  /**
   * Get public key
   */
  async getPublicKey(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    return this.keyPair.publicKey;
  }

  /**
   * Encrypt message (placeholder implementation)
   * 
   * In production, use:
   * - X25519 key exchange (convert Ed25519 keys)
   * - XSalsa20-Poly1305 authenticated encryption
   * - Or use TweetNaCl.js / libsodium
   */
  async encryptMessage(
    message: string,
    recipientPublicKey: string
  ): Promise<EncryptedPayload> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    try {
      // Placeholder encryption (use proper NaCl box in production)
      const nonce = this.generateRandomBytes(24);
      const messageBytes = Buffer.from(message, 'utf-8');
      
      // Simple XOR encryption (NOT SECURE - placeholder only)
      const ciphertext = new Uint8Array(messageBytes.length);
      const keyBytes = Buffer.from(recipientPublicKey, 'base64');
      
      for (let i = 0; i < messageBytes.length; i++) {
        ciphertext[i] = messageBytes[i] ^ keyBytes[i % keyBytes.length] ^ nonce[i % nonce.length];
      }

      // Sign the ciphertext
      const signature = await this.sign(ciphertext);

      return {
        encrypted: true,
        nonce: Buffer.from(nonce).toString('base64'),
        ciphertext: Buffer.from(ciphertext).toString('base64'),
        signature,
        senderPublicKey: this.keyPair.publicKey,
      };
    } catch (error) {
      console.error('[Crypto] Error encrypting message:', error);
      throw error;
    }
  }

  /**
   * Decrypt message (placeholder implementation)
   */
  async decryptMessage(
    encryptedPayload: EncryptedPayload,
    senderPublicKey: string
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    try {
      // Verify signature first
      const ciphertext = Buffer.from(encryptedPayload.ciphertext, 'base64');
      const isValid = await this.verify(ciphertext, encryptedPayload.signature, senderPublicKey);
      
      if (!isValid) {
        throw new Error('Invalid signature - message may be tampered');
      }

      // Decrypt (placeholder - use proper NaCl box_open in production)
      const nonce = Buffer.from(encryptedPayload.nonce, 'base64');
      const plaintext = new Uint8Array(ciphertext.length);
      const keyBytes = Buffer.from(this.keyPair.privateKey, 'base64');
      
      for (let i = 0; i < ciphertext.length; i++) {
        plaintext[i] = ciphertext[i] ^ keyBytes[i % keyBytes.length] ^ nonce[i % nonce.length];
      }

      return Buffer.from(plaintext).toString('utf-8');
    } catch (error) {
      console.error('[Crypto] Error decrypting message:', error);
      throw error;
    }
  }

  /**
   * Sign data with private key (placeholder)
   * In production, use Ed25519 signing
   */
  private async sign(data: Uint8Array): Promise<string> {
    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    // Placeholder signature (use Ed25519 sign in production)
    const privateKeyBytes = Buffer.from(this.keyPair.privateKey, 'base64');
    const signature = new Uint8Array(64);
    
    // Simple hash-based signature (NOT SECURE - placeholder)
    for (let i = 0; i < 64; i++) {
      signature[i] = (data[i % data.length] + privateKeyBytes[i % privateKeyBytes.length]) % 256;
    }

    return Buffer.from(signature).toString('base64');
  }

  /**
   * Verify signature (placeholder)
   * In production, use Ed25519 verify
   */
  private async verify(
    data: Uint8Array,
    signatureBase64: string,
    publicKeyBase64: string
  ): Promise<boolean> {
    try {
      // Placeholder verification (use Ed25519 verify in production)
      const signature = Buffer.from(signatureBase64, 'base64');
      const publicKey = Buffer.from(publicKeyBase64, 'base64');
      
      // Simple verification (NOT SECURE - placeholder)
      for (let i = 0; i < Math.min(64, signature.length); i++) {
        const expected = (data[i % data.length] + publicKey[i % publicKey.length]) % 256;
        if (signature[i] !== expected) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('[Crypto] Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Hash data (SHA-256)
   */
  async hashData(data: string): Promise<string> {
    // Use a simple hash (in production, use proper SHA-256)
    const bytes = Buffer.from(data, 'utf-8');
    let hash = 0;
    
    for (let i = 0; i < bytes.length; i++) {
      hash = ((hash << 5) - hash) + bytes[i];
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(16).padStart(8, '0');
  }

  /**
   * Check if encryption is enabled
   */
  isEncryptionEnabled(): boolean {
    return this.isInitialized && this.keyPair !== null;
  }

  /**
   * Reset keys (for testing/development)
   */
  async resetKeys(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SECURE_KEYS.PUBLIC_KEY);
      await SecureStore.deleteItemAsync(SECURE_KEYS.PRIVATE_KEY);
      this.keyPair = null;
      this.isInitialized = false;
      
      console.log('[Crypto] Keys reset');
    } catch (error) {
      console.error('[Crypto] Error resetting keys:', error);
      throw error;
    }
  }

  /**
   * Export public key for sharing
   */
  async exportPublicKey(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.keyPair) {
      throw new Error('Key pair not initialized');
    }

    return this.keyPair.publicKey;
  }
}

// Singleton instance
export const cryptoService = new CryptoService();

/**
 * PRODUCTION IMPLEMENTATION NOTES:
 * 
 * For a secure production implementation, replace placeholder crypto with:
 * 
 * 1. Install proper crypto library:
 *    npm install @noble/ed25519 @noble/curves
 *    or
 *    npm install tweetnacl tweetnacl-util
 * 
 * 2. Use Ed25519 for signing:
 *    import * as ed from '@noble/ed25519';
 *    const privateKey = ed.utils.randomPrivateKey();
 *    const publicKey = await ed.getPublicKey(privateKey);
 *    const signature = await ed.sign(message, privateKey);
 *    const isValid = await ed.verify(signature, message, publicKey);
 * 
 * 3. Convert Ed25519 to X25519 for encryption:
 *    import { x25519 } from '@noble/curves/ed25519';
 *    const sharedSecret = x25519.getSharedSecret(privateKey, theirPublicKey);
 * 
 * 4. Use XSalsa20-Poly1305 for authenticated encryption:
 *    import nacl from 'tweetnacl';
 *    const encrypted = nacl.box(message, nonce, theirPublicKey, myPrivateKey);
 *    const decrypted = nacl.box.open(encrypted, nonce, theirPublicKey, myPrivateKey);
 * 
 * 5. Update MeshCore protocol to include encryption metadata
 * 
 * The current implementation provides the structure and API but uses
 * placeholder cryptography for demonstration purposes only.
 */
