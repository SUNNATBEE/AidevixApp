import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface XPToastProps {
  xp: number;
  onDone?: () => void;
}

/**
 * XP olindi animatsiyasi — yuqoriga uchib ketadi.
 * Ishlatish: <XPToast xp={100} onDone={() => setShowXP(false)} />
 */
const XPToast = ({ xp, onDone }: XPToastProps) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Paydo bo'lish
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    // Yuqoriga uchib ketish
    translateY.value = withSequence(
      withTiming(-10, { duration: 200 }),
      withTiming(-60, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    // Yo'qolish
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onDone) runOnJS(onDone)();
      });
    }, 700);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Ionicons name="flash" size={16} color="#f59e0b" />
      <Text style={styles.text}>+{xp} XP</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  text: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default XPToast;
