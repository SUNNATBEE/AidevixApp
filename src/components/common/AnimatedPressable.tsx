import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  scaleDown?: number; // default 0.95
}

const AnimatedPressable = ({
  onPress,
  onLongPress,
  children,
  style,
  disabled,
  scaleDown = 0.95,
}: AnimatedPressableProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(scaleDown, { damping: 15, stiffness: 300 });
        opacity.value = withTiming(0.85, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
        opacity.value = withTiming(1, { duration: 120 });
      }}
    >
      <Animated.View style={[animStyle, style as any]}>{children}</Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;
