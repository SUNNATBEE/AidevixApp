import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface SectionHeaderProps {
  title: string;
  /** o'ng tomondagi harakat matni (masalan "Hammasi") */
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

/** Bo'lim sarlavhasi + ixtiyoriy "Hammasi" havolasi. Ekranlar bo'ylab izchil. */
const SectionHeader = ({ title, actionLabel, onActionPress, style }: SectionHeaderProps) => {
  const { colors, typography } = useTheme();
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.lg }]}>
        {title}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onActionPress} hitSlop={8}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontWeight: '700' },
});

export default SectionHeader;
