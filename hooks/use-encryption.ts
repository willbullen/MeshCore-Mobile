import { useState, useEffect, useCallback } from 'react';
import { cryptoService, type EncryptedPayload } from '@/lib/crypto-service';

export interface EncryptionState {
  isEnabled: boolean;
  isInitialized: boolean;
  publicKey: string | null;
  error: string | null;
}

export interface EncryptionActions {
  initialize: () => Promise<void>;
  getPublicKey: () => Promise<string>;
  encryptMessage: (message: string, recipientPublicKey: string) => Promise<EncryptedPayload>;
  decryptMessage: (payload: EncryptedPayload, senderPublicKey: string) => Promise<string>;
  resetKeys: () => Promise<void>;
}

export function useEncryption(): [EncryptionState, EncryptionActions] {
  const [state, setState] = useState<EncryptionState>({
    isEnabled: false,
    isInitialized: false,
    publicKey: null,
    error: null,
  });

  // Initialize on mount
  useEffect(() => {
    initializeCrypto();
  }, []);

  /**
   * Initialize crypto service
   */
  const initializeCrypto = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      await cryptoService.initialize();
      const publicKey = await cryptoService.getPublicKey();

      setState({
        isEnabled: cryptoService.isEncryptionEnabled(),
        isInitialized: true,
        publicKey,
        error: null,
      });

      console.log('[useEncryption] Crypto initialized');
    } catch (error: any) {
      console.error('[useEncryption] Initialization error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to initialize encryption',
        isInitialized: false,
      }));
    }
  }, []);

  /**
   * Initialize crypto manually
   */
  const initialize = useCallback(async () => {
    await initializeCrypto();
  }, [initializeCrypto]);

  /**
   * Get public key
   */
  const getPublicKey = useCallback(async (): Promise<string> => {
    try {
      return await cryptoService.exportPublicKey();
    } catch (error) {
      console.error('[useEncryption] Error getting public key:', error);
      throw error;
    }
  }, []);

  /**
   * Encrypt a message
   */
  const encryptMessage = useCallback(
    async (message: string, recipientPublicKey: string): Promise<EncryptedPayload> => {
      try {
        if (!state.isInitialized) {
          throw new Error('Encryption not initialized');
        }

        const encrypted = await cryptoService.encryptMessage(message, recipientPublicKey);
        console.log('[useEncryption] Message encrypted');
        return encrypted;
      } catch (error: any) {
        console.error('[useEncryption] Encryption error:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to encrypt message',
        }));
        throw error;
      }
    },
    [state.isInitialized]
  );

  /**
   * Decrypt a message
   */
  const decryptMessage = useCallback(
    async (payload: EncryptedPayload, senderPublicKey: string): Promise<string> => {
      try {
        if (!state.isInitialized) {
          throw new Error('Encryption not initialized');
        }

        const decrypted = await cryptoService.decryptMessage(payload, senderPublicKey);
        console.log('[useEncryption] Message decrypted');
        return decrypted;
      } catch (error: any) {
        console.error('[useEncryption] Decryption error:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to decrypt message',
        }));
        throw error;
      }
    },
    [state.isInitialized]
  );

  /**
   * Reset encryption keys
   */
  const resetKeys = useCallback(async () => {
    try {
      await cryptoService.resetKeys();
      setState({
        isEnabled: false,
        isInitialized: false,
        publicKey: null,
        error: null,
      });
      
      // Reinitialize
      await initializeCrypto();
      
      console.log('[useEncryption] Keys reset and regenerated');
    } catch (error: any) {
      console.error('[useEncryption] Error resetting keys:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to reset keys',
      }));
      throw error;
    }
  }, [initializeCrypto]);

  const actions: EncryptionActions = {
    initialize,
    getPublicKey,
    encryptMessage,
    decryptMessage,
    resetKeys,
  };

  return [state, actions];
}
