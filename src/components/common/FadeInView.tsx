import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Fade + hafif yuqoridan pastga siljish animatsiyasi.
 * Ekran elementlari ketma-ket paydo bo'lishi uchun `delay` bering.
 */
const FadeInView = ({
  children,
  delay = 0,
  duration = 400,
  style,
}: FadeInViewProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animStyle, style as any]}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;
