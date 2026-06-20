import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface StreakCounterProps {
  count: number;
  size?: 'small' | 'large';
}

const StreakCounter = ({ count, size = 'small' }: StreakCounterProps) => {
  const { colors } = useTheme();
  const isLarge = size === 'large';

  // count o'zgarganda olov "lov etib" oshadi (pop)
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSequence(
      withTiming(isLarge ? 1.25 : 1.2, { duration: 160 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, [count]);

  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.container, isLarge && styles.largeContainer]}>
      <Animated.View style={flameStyle}>
        <Ionicons name="flame" size={isLarge ? 80 : 24} color={colors.accent} />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={[styles.count, { color: colors.text, fontSize: isLarge ? 32 : 18 }]}>
          {count}
        </Text>
        {isLarge && (
          <Text style={[styles.label, { color: colors.textSecondary }]}>KUNLIK STREAK</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  largeContainer: { flexDirection: 'column', justifyContent: 'center' },
  textContainer: { alignItems: 'center' },
  count: { fontWeight: 'bold' },
  label: { fontSize: 12, marginTop: 4 },
});

export default StreakCounter;
