import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientCard from '../../components/common/GradientCard';
import StatCard from '../../components/common/StatCard';
import { useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import axiosInstance from '../../api/axiosInstance';
import { UserStats } from '../../types/user';

const DAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const AnalyticsScreen = ({ navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const ranking = useAppSelector((state) => state.ranking);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [weeklyXp, setWeeklyXp] = useState<number[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/xp/stats');
      const data: UserStats = res.data;
      setStats(data);
      if (data.weeklyXp) {
        // Mock: spread weeklyXp into 7 days if API doesn't give breakdown
        setWeeklyXp(generateMockWeekly(data.weeklyXp));
      } else {
        setWeeklyXp(generateMockWeekly(user?.xp || 0));
      }
    } catch {
      // Fallback to local data
      setStats(null);
      setWeeklyXp(generateMockWeekly(user?.xp || 0));
    }
  };

  const generateMockWeekly = (totalXp: number): number[] => {
    const base = Math.floor(totalXp / 7);
    return DAYS.map((_, i) => {
      const variance = Math.floor(Math.random() * base * 0.5);
      return Math.max(0, base + (i % 2 === 0 ? variance : -variance));
    });
  };

  const maxXp = Math.max(...weeklyXp, 1);

  const totalXp = stats?.xp ?? user?.xp ?? 0;
  const streak = stats?.streak ?? user?.streak ?? 0;
  const videosWatched = stats?.videosWatched;
  const rankTitle = (ranking as any)?.myRank?.rankTitle || user?.rankTitle || 'AMATEUR';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Analitika</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Haftalik XP grafigi */}
        <GradientCard variant="brand" style={{ padding: spacing.lg }}>
          <Text style={styles.sectionTitle}>Haftalik XP grafigi</Text>
          <View style={styles.chartContainer}>
            {weeklyXp.map((xp, i) => {
              const height = Math.max(4, (xp / maxXp) * 100);
              return (
                <View key={i} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{xp}</Text>
                  <View style={[styles.bar, { height, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: radii.sm }]} />
                  <Text style={styles.dayLabel}>{DAYS[i]}</Text>
                </View>
              );
            })}
          </View>
        </GradientCard>

        {/* Umumiy statistika */}
        <View>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Umumiy statistika</Text>
          <View style={styles.statsRow}>
            <StatCard icon="flash" value={totalXp.toLocaleString()} label="Jami XP" color={colors.accent} />
            <StatCard icon="flame" value={streak} label="Joriy streak" color={colors.error} />
          </View>
          <View style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.md }]}>
            <Ionicons name="star" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>Sevimli kategoriya</Text>
              <Text style={[styles.categoryValue, { color: colors.text }]}>Frontend</Text>
            </View>
          </View>
        </View>

        {/* Dars faolligi */}
        <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}>
          <View style={styles.activityHeader}>
            <Ionicons name="play-circle" size={22} color={colors.secondary} />
            <Text style={[styles.activityTitle, { color: colors.text }]}>Dars faolligi</Text>
          </View>
          <View style={styles.activityRow}>
            <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>Ko'rilgan videolar</Text>
            <Text style={[styles.activityValue, { color: colors.text }]}>
              {videosWatched != null ? videosWatched : '—'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.activityRow}>
            <Text style={[styles.activityLabel, { color: colors.textSecondary }]}>Yakunlangan testlar</Text>
            <Text style={[styles.activityValue, { color: colors.text }]}>
              {stats?.quizzesCompleted != null ? stats.quizzesCompleted : '—'}
            </Text>
          </View>
        </View>

        {/* Reyting */}
        <View style={[styles.rankCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}>
          <View style={styles.rankHeader}>
            <Ionicons name="trophy" size={22} color={colors.accent} />
            <Text style={[styles.rankTitle, { color: colors.text }]}>Reyting</Text>
          </View>
          <View style={[styles.rankBadge, { backgroundColor: colors.primary + '18', borderRadius: radii.md }]}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={[styles.rankBadgeText, { color: colors.primary }]}>{rankTitle}</Text>
          </View>
          <Text style={[styles.rankDesc, { color: colors.textSecondary }]}>
            Yangi darajaga chiqish uchun ko'proq XP yig'ing
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 16 },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barValue: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  bar: { width: '100%', minHeight: 4 },
  dayLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  categoryLabel: { fontSize: 12 },
  categoryValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  activityCard: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activityTitle: { fontSize: 16, fontWeight: '700' },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityLabel: { fontSize: 14 },
  activityValue: { fontSize: 16, fontWeight: '700' },
  divider: { height: 1 },
  rankCard: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  rankHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankTitle: { fontSize: 16, fontWeight: '700' },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rankBadgeText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  rankDesc: { fontSize: 13, lineHeight: 18 },
});

export default AnalyticsScreen;
