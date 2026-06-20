import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  // Bosiladigan karta uchun — berilsa TouchableOpacity, aks holda oddiy View
  onPress?: () => void;
  // Ichki bo'shliqни o'chirish (masalan rasm/list to'liq enini egallasin)
  noPadding?: boolean;
}

/**
 * Minimal yuza primitivi: card fon, 1px nozik chegara, radii.lg, izchil padding.
 * Ekranlar inline `styles.card` o'rniga shuni ishlatadi.
 */
const Card = ({ children, style, onPress, noPadding = false }: CardProps) => {
  const { colors, spacing, radii } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: noPadding ? 0 : spacing.lg,
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, cardStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
