import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { shadow, useTheme } from '../../theme';
import IconBadge from './IconBadge';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  /** urg'u rangi (ikon + qiymat). Default: theme.primary */
  color?: string;
  style?: ViewStyle;
}

/** Statistika kartasi: ikon + katta qiymat + label. Profil/Leaderboard uchun. */
const StatCard = ({ icon, value, label, color, style }: StatCardProps) => {
  const { colors, radii, typography } = useTheme();
  const c = color ?? colors.primary;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radii.lg,
        },
        shadow('sm', colors.shadow),
        style,
      ]}
    >
      <IconBadge name={icon} color={c} size={40} />
      <Text style={[styles.value, { color: colors.text, fontSize: typography.sizes.xl }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  value: { fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '500' },
});

export default StatCard;
