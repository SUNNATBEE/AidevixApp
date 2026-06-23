import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FadeInView from '../../components/common/FadeInView';
import { useAppDispatch } from '../../store/hooks';
import { addDownloadedVideo } from '../../store/slices/offlineSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { downloadVideo, getLocalVideoUri } from '../../utils/download';
import BookmarkModal from './BookmarkModal';

const VideoPlayerScreen = ({ route }: any) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { videoId, courseId } = route.params;

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Bu URL haqiqiy Bunny CDN URL'dan API orqali kelishi kerak
  const videoUrl = 'https://example.com/video.mp4';
  const storageKey = `@offline_video_${videoId}`;

  useEffect(() => {
    checkDownloaded();
  }, [videoId]);

  const checkDownloaded = async () => {
    try {
      const localUri = await getLocalVideoUri(videoId);
      if (localUri) {
        setIsDownloaded(true);
        await AsyncStorage.setItem(storageKey, localUri);
      } else {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) setIsDownloaded(true);
      }
    } catch {
      // ignore
    }
  };

  const handleDownload = async () => {
    if (isDownloaded || isDownloading) return;
    triggerHaptic('medium');
    setIsDownloading(true);
    setDownloadProgress(0);

    const uri = await downloadVideo(videoUrl, videoId, (progress) => {
      setDownloadProgress(Math.round(progress * 100));
    });

    if (uri) {
      setIsDownloaded(true);
      setIsDownloading(false);
      setDownloadProgress(null);
      triggerHaptic('success');
      await AsyncStorage.setItem(storageKey, uri);
      dispatch(
        addDownloadedVideo({
          _id: videoId,
          title: 'Video darslik',
          description: '',
          course: courseId || '',
          order: 0,
          duration: '0',
          thumbnail: '',
          bunnyVideoId: '',
          bunnyStatus: 'finished',
          viewCount: 0,
        })
      );
    } else {
      setIsDownloading(false);
      setDownloadProgress(null);
      triggerHaptic('error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Video maydoni */}
      <View style={styles.videoContainer}>
        <Text style={styles.videoPlaceholderText}>Video pleer (Bunny.net)</Text>

        {/* Yuklab olish tugmasi */}
        <TouchableOpacity
          style={[styles.downloadBtn, { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radii.md }]}
          onPress={handleDownload}
          disabled={isDownloaded || isDownloading}
          activeOpacity={0.8}
        >
          {isDownloading ? (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.progressText}>{downloadProgress ?? 0}%</Text>
            </View>
          ) : isDownloaded ? (
            <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
          ) : (
            <Ionicons name="cloud-download-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Bookmark tugmasi */}
        <TouchableOpacity
          style={[styles.bookmarkBtn, { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radii.md }]}
          onPress={() => {
            triggerHaptic('light');
            setShowBookmarks(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="bookmark-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FadeInView style={[styles.content, { padding: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Video darslik</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Ushbu darsda biz AI platformamizdan qanday samarali foydalanishni o'rganamiz.
        </Text>
        {isDownloaded && (
          <View style={[styles.downloadedBadge, { backgroundColor: colors.success + '22', borderRadius: radii.sm }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.downloadedBadgeText, { color: colors.success }]}>
              Oflayn saqlangan
            </Text>
          </View>
        )}
      </FadeInView>

      <BookmarkModal
        visible={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        videoId={videoId}
        courseId={courseId || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: { color: 'rgba(255,255,255,0.6)' },
  downloadBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 62,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    gap: 2,
  },
  progressText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16, lineHeight: 24 },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },
  downloadedBadgeText: { fontSize: 12, fontWeight: '600' },
});

export default VideoPlayerScreen;
