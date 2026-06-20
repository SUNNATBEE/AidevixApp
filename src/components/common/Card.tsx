import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { shadow, useTheme } from '../../theme';
import AnimatedPressable from './AnimatedPressable';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  // Bosiladigan karta uchun — berilsa bosish, aks holda oddiy View
  onPress?: () => void;
  // Ichki bo'shliqni o'chirish (masalan rasm/list to'liq enini egallasin)
  noPadding?: boolean;
  // Bosishda scale + haptic animatsiyasi (onPress bilan). Default: true
  animated?: boolean;
  // Ko'tarilgan yuza (cardElevated foni + kuchliroq soya)
  elevated?: boolean;
}

/**
 * Yuza primitivi: card fon, nozik chegara, radii.lg, soft soya, izchil padding.
 * Ekranlar inline `styles.card` o'rniga shuni ishlatadi.
 */
const Card = ({
  children,
  style,
  onPress,
  noPadding = false,
  animated = true,
  elevated = false,
}: CardProps) => {
  const { colors, spacing, radii } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: elevated ? colors.cardElevated : colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: noPadding ? 0 : spacing.lg,
    ...shadow(elevated ? 'md' : 'sm', colors.shadow),
  };

  const merged = [styles.card, cardStyle, style];

  if (onPress) {
    if (animated) {
      return (
        <AnimatedPressable onPress={onPress} scaleDown={0.98} style={merged as any}>
          {children}
        </AnimatedPressable>
      );
    }
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={merged}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={merged}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
