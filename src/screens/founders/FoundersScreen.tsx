import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { FOUNDERS, Founder } from '../../data/founders';

// Rasm yuklanmasa (404/oflayn) ism bosh harfidan rangli avatar ko'rsatadi.
const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7', '#ec4899', '#14b8a6'];

const Avatar = ({ founder, index, size }: { founder: Founder; index: number; size: number }) => {
  const { typography } = useTheme();
  const [failed, setFailed] = useState(false);
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = founder.name.trim().charAt(0).toUpperCase();

  if (failed) {
    return (
      <View
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        ]}
      >
        <Text style={{ color: '#fff', fontSize: size * 0.4, fontWeight: typography.weights.bold }}>
          {initial}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: founder.image }}
      onError={() => setFailed(true)}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
};

const FoundersScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          hitSlop={10}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
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
          Asoschilar
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge, paddingHorizontal: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.sm,
            marginBottom: spacing.lg,
            marginHorizontal: spacing.xs,
          }}
        >
          {'Platformani yaratgan yosh dasturchilar jamoasi — har biri haqiqiy production kodiga mas\'ul.'}
        </Text>

        {FOUNDERS.map((founder, index) => (
          <View
            key={founder.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: founder.lead ? colors.primary : colors.border,
                borderRadius: radii.xl,
                padding: spacing.lg,
                marginBottom: spacing.md,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <Avatar founder={founder} index={index} size={56} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={styles.nameRow}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.sizes.lg,
                      fontWeight: typography.weights.bold,
                    }}
                  >
                    {founder.name}
                  </Text>
                  {founder.age != null && (
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: typography.sizes.xs,
                        marginLeft: spacing.sm,
                      }}
                    >
                      · {founder.age} yosh
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor: founder.lead ? colors.primary : colors.primarySoft,
                      borderRadius: radii.pill,
                      marginTop: spacing.xs,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: founder.lead ? '#ffffff' : colors.primary,
                      fontSize: typography.sizes.xs,
                      fontWeight: typography.weights.semibold,
                    }}
                  >
                    {founder.role}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
                marginTop: spacing.md,
              }}
            >
              {founder.task}
            </Text>
          </View>
        ))}
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
  card: {
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default FoundersScreen;
