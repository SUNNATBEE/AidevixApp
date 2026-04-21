import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ShortsScreen = () => {
  const { colors } = useTheme();
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

  const shortsData = [
    { id: '1', title: 'React Hooks nima?', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', author: '@jasur_ai' },
    { id: '2', title: 'AI bilan kod yozish', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', author: '@nodira_dev' },
    { id: '3', title: 'Cursor vs Code', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', author: '@admin' },
  ];

  const renderItem = ({ item, index }: any) => (
    <View style={styles.shortContainer}>
      <Video
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={index === currentVisibleIndex}
        isLooping
      />
      <View style={styles.overlay}>
        <View style={styles.bottomInfo}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.sideActions}>
          <ActionButton name="heart" label="1.2k" />
          <ActionButton name="chatbubble" label="45" />
          <ActionButton name="share-social" label="Share" />
          <ActionButton name="bookmark" label="Save" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <FlatList
        data={shortsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / height);
          setCurrentVisibleIndex(index);
        }}
      />
    </View>
  );
};

const ActionButton = ({ name, label }: any) => (
  <TouchableOpacity style={styles.actionItem}>
    <Ionicons name={name} size={30} color="#fff" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shortContainer: {
    width: width,
    height: height,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bottomInfo: {
    marginBottom: 40,
    maxWidth: '80%',
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
  },
  sideActions: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ShortsScreen;
