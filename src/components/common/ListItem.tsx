import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import AnimatedPressable from './AnimatedPressable';
import IconBadge from './IconBadge';

interface ListItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  /** o'ng tomonda matn (masalan qiymat yoki "Pro") */
  value?: string;
  onPress?: () => void;
  /** o'ng chevron ko'rsatish. Default: onPress bo'lsa true */
  chevron?: boolean;
  /** o'ng tomonga maxsus element (Switch va h.k.) */
  right?: React.ReactNode;
  danger?: boolean;
  style?: ViewStyle;
}

/** Sozlamalar/menyu qatori: ikon + sarlavha/tavsif + qiymat/chevron. */
const ListItem = ({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  onPress,
  chevron,
  right,
  danger,
  style,
}: ListItemProps) => {
  const { colors, radii } = useTheme();
  const showChevron = chevron ?? (!!onPress && !right);
  const titleColor = danger ? colors.error : colors.text;

  const body = (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg },
        style,
      ]}
    >
      {icon ? (
        <IconBadge name={icon} color={danger ? colors.error : iconColor ?? colors.primary} size={40} />
      ) : null}
      <View style={styles.texts}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text> : null}
      {right}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} scaleDown={0.98}>
        {body}
      </AnimatedPressable>
    );
  }
  return body;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  texts: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  subtitle: { fontSize: 13, marginTop: 2 },
  value: { fontSize: 14, fontWeight: '500' },
});

export default ListItem;
