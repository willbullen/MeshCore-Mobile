/**
 * Media Message Component
 * 
 * Displays image, audio, or file attachments in chat messages.
 */

import { useState } from 'react';
import { View, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { FileTransferProgress } from '@/lib/file-transfer';

export interface MediaMessageProps {
  type: 'image' | 'audio' | 'file';
  uri?: string;
  fileName: string;
  fileSize: number;
  progress?: FileTransferProgress;
  onPress?: () => void;
}

export function MediaMessage({
  type,
  uri,
  fileName,
  fileSize,
  progress,
  onPress,
}: MediaMessageProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (): string => {
    switch (type) {
      case 'image':
        return 'photo.fill';
      case 'audio':
        return 'waveform';
      case 'file':
      default:
        return 'doc.fill';
    }
  };

  // Render progress bar if transfer in progress
  if (progress && progress.status !== 'complete') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.progressContainer}>
          <IconSymbol name={getFileIcon()} size={32} color={colors.primary} />
          <View style={styles.progressInfo}>
            <ThemedText style={styles.fileName} numberOfLines={1}>
              {fileName}
            </ThemedText>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress.percentage}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <ThemedText style={[styles.progressText, { color: colors.textSecondary }]}>
              {progress.status === 'sending' ? 'Sending' : 'Receiving'} {progress.percentage}%
            </ThemedText>
          </View>
          {progress.status === 'sending' || progress.status === 'receiving' ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}
        </View>
      </View>
    );
  }

  // Render image
  if (type === 'image' && uri && !imageError) {
    return (
      <Pressable onPress={onPress} style={styles.imageContainer}>
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <ThemedText style={styles.imageSizeText}>{formatFileSize(fileSize)}</ThemedText>
        </View>
      </Pressable>
    );
  }

  // Render audio or file
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <IconSymbol name={getFileIcon()} size={40} color={colors.primary} />
      <View style={styles.fileInfo}>
        <ThemedText style={styles.fileName} numberOfLines={1}>
          {fileName}
        </ThemedText>
        <ThemedText style={[styles.fileSize, { color: colors.textSecondary }]}>
          {formatFileSize(fileSize)}
        </ThemedText>
      </View>
      <IconSymbol name="arrow.down.circle" size={24} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    minWidth: 200,
  },
  imageContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: BorderRadius.md,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xs,
    alignItems: 'flex-end',
  },
  imageSizeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  fileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  progressInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
  },
});
