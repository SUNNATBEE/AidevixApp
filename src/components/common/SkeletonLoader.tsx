import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';

const SkeletonLoader = ({ width = '100%', height = 100, borderRadius = 12 }: any) => {
  const { colors } = useTheme();
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border,
          borderRadius,
          opacity,
        },
      ]}
    />
  );
};

export default SkeletonLoader;
