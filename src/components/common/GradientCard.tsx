import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { shadow, useTheme } from '../../theme';
import AnimatedPressable from './AnimatedPressable';

interface GradientCardProps {
  children: React.ReactNode;
  /** gradient kaliti: brand (default), brandVivid, accent, success, info */
  variant?: 'brand' | 'brandVivid' | 'accent' | 'success' | 'info';
  /** to'g'ridan-to'g'ri ranglar berish (variant'ni bekor qiladi) */
  colors?: readonly [string, string, ...string[]];
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  /** rangli porlash soyasi. Default: true */
  glow?: boolean;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

/**
 * Gradient fonli karta — hero / CTA / challenge bloklari uchun.
 * onPress berilsa bosishda scale + haptic (AnimatedPressable).
 */
const GradientCard = ({
  children,
  variant = 'brand',
  colors,
  onPress,
  style,
  glow = true,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientCardProps) => {
  const { gradients, radii } = useTheme();
  const stops = colors ?? gradients[variant];
  const glowStyle = glow ? shadow('glow', stops[0]) : undefined;

  const content = (
    <LinearGradient
      colors={stops}
      start={start}
      end={end}
      style={[styles.card, { borderRadius: radii.xl }, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} style={[{ borderRadius: radii.xl }, glowStyle] as any}>
        {content}
      </AnimatedPressable>
    );
  }

  return <View style={glowStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    overflow: 'hidden',
  },
});

export default GradientCard;
