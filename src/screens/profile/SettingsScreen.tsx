import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';

type ThemeMode = 'light' | 'dark' | 'amoled';

const SettingsScreen = () => {
  const { colors, spacing, typography, themeMode, setThemeMode } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    Alert.alert(
      'Akauntdan chiqish',
      'Rostdan ham chiqmoqchimisiz?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Chiqish',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('warning');
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleTheme = (next: ThemeMode) => {
    if (next === themeMode) return;
    triggerHaptic('light');
    setThemeMode(next);
  };

  const handleEditProfile = () => {
    triggerHaptic('light');
    navigation.navigate('EditProfile');
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        marginLeft: spacing.lg,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
      }}
    >
      {title}
    </Text>
  );

  const Row = ({
    icon,
    title,
    subtitle,
    onPress,
    right,
    danger,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          opacity: pressed ? 0.7 : 1,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: danger ? colors.error + '18' : colors.primary + '18',
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text
          style={{
            color: danger ? colors.error : colors.text,
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.semibold,
          }}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {right ?? (onPress && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ))}
    </Pressable>
  );

  const SegmentedPicker = <T extends string>({
    value,
    options,
    onChange,
  }: {
    value: T;
    options: { value: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
    onChange: (v: T) => void;
  }) => (
    <View
      style={[
        styles.segmented,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          padding: 4,
        },
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              {
                backgroundColor: active ? colors.primary : 'transparent',
                paddingVertical: spacing.xs + 2,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            {opt.icon && (
              <Ionicons
                name={opt.icon}
                size={14}
                color={active ? '#ffffff' : colors.textSecondary}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={{
                color: active ? '#ffffff' : colors.textSecondary,
                fontWeight: active ? typography.weights.bold : typography.weights.medium,
                fontSize: typography.sizes.xs,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          hitSlop={10}
          style={[
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.xxl,
            fontWeight: typography.weights.bold,
            marginLeft: spacing.md,
          }}
        >
          Sozlamalar
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Akkaunt" />
        <Row
          icon="person-circle-outline"
          title="Profilni tahrirlash"
          subtitle={
            user
              ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
              : ''
          }
          onPress={handleEditProfile}
        />

        <SectionHeader title="Ko'rinish" />
        <Row
          icon="color-palette-outline"
          title="Mavzu"
          subtitle="Yorug', qora yoki amoled"
          right={
            <SegmentedPicker
              value={themeMode}
              onChange={handleTheme}
              options={[
                { value: 'light', label: "Yorug'", icon: 'sunny-outline' },
                { value: 'dark', label: 'Qora', icon: 'moon-outline' },
                { value: 'amoled', label: 'AMOLED', icon: 'contrast-outline' },
              ]}
            />
          }
        />

        <SectionHeader title="Xavfsizlik" />
        <Row
          icon="log-out-outline"
          title="Akauntdan chiqish"
          subtitle={user?.email}
          onPress={handleLogout}
          danger
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
  },
});

export default SettingsScreen;
