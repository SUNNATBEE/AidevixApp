import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  /** ScrollView ichida render qilish (uzun kontent uchun). Default: true */
  scroll?: boolean;
  /** Pull-to-refresh */
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Gorizontal padding (spacing.xl) qo'shadi. Default: true */
  padded?: boolean;
  /** SafeArea qaysi tomonlarni hisobga olsin. Default: ['top'] */
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/**
 * Har bir ekranning tashqi qobig'i: SafeArea + theme foni + ixtiyoriy scroll/refresh.
 * Ekran ichidagi bo'limlarni <FadeInView delay={...}> bilan ketma-ket jonlantiring.
 */
const Screen = ({
  children,
  scroll = true,
  refreshing,
  onRefresh,
  padded = true,
  edges = ['top'],
  style,
  contentContainerStyle,
}: ScreenProps) => {
  const { colors, spacing } = useTheme();
  const pad = padded ? { paddingHorizontal: spacing.xl } : null;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[pad, { paddingBottom: spacing.huge * 2 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, pad, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors.background }, style]}
    >
      {body}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default Screen;
