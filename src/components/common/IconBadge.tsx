import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface IconBadgeProps {
  name: keyof typeof Ionicons.glyphMap;
  /** ikon (va tint foni) rangi. Default: theme.primary */
  color?: string;
  /** badge o'lchami. Default: 44 */
  size?: number;
  /** ikon o'lchami. Default: size * 0.5 */
  iconSize?: number;
  /** to'liq to'ldirilgan fon (tint emas) */
  filled?: boolean;
  style?: ViewStyle;
}

/**
 * Yumaloq tintlangan ikon konteyneri. Inline `color + '15'` o'rniga ishlating —
 * tint izchil 16% alfa beradi.
 */
const IconBadge = ({
  name,
  color,
  size = 44,
  iconSize,
  filled = false,
  style,
}: IconBadgeProps) => {
  const { colors, radii } = useTheme();
  const c = color ?? colors.primary;
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: radii.lg,
          backgroundColor: filled ? c : tint(c),
        },
        style,
      ]}
    >
      <Ionicons name={name} size={iconSize ?? size * 0.5} color={filled ? '#fff' : c} />
    </View>
  );
};

// hex/rgb rangni 16% alfali tintga aylantiradi
const tint = (c: string) => {
  if (c.startsWith('#') && c.length === 7) return c + '29'; // ~16%
  return c;
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconBadge;
