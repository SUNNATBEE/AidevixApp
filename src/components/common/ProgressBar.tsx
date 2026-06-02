import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
  delay?: number;
  style?: ViewStyle;
}

const ProgressBar = ({
  progress,
  color,
  trackColor,
  height = 6,
  borderRadius = 999,
  delay = 0,
  style,
}: ProgressBarProps) => {
  const { colors } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(Math.min(100, Math.max(0, progress)), {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius,
          backgroundColor: trackColor ?? colors.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius,
            backgroundColor: color ?? colors.primary,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {},
});

export default ProgressBar;
