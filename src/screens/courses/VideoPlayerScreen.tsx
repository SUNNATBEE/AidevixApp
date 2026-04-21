import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { useAppSelector } from '../../store/hooks';
// import { Video } from 'expo-av'; // Using expo-av as requested or react-native-video

const VideoPlayerScreen = ({ route }: any) => {
  const { colors, spacing } = useTheme();
  const { videoId } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.videoContainer}>
        <Text style={{ color: '#fff' }}>Video pleer (Bunny.net)</Text>
        {/* Actual video player implementation would go here */}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Video darslik</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Ushbu darsda biz AI platformamizdan qanday samarali foydalanishni o'rganamiz.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default VideoPlayerScreen;
