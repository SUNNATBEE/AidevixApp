import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FadeInView from '../../components/common/FadeInView';
import GradientCard from '../../components/common/GradientCard';
import Loader from '../../components/common/Loader';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    Challenge,
    fetchChallengeProgress,
    fetchTodayChallenges,
} from '../../store/slices/challengeSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

// Fallback: backend javob bermasa ko'rsatiladigan static challengelar
const STATIC_CHALLENGES: Challenge[] = [
  {
    _id: 'one-lesson',
    title: '1ta dars ko\'rish',
    description: 'Bugun kamida bitta darsni tomosha qiling',
    reward: 100,
    icon: 'play-circle',
    color: '#6366f1',
    progress: 0,
    target: 1,
    status: 'not_started',
  },
  {
    _id: 'two-lessons',
    title: 'Kamida 2ta dars ko\'rish',
    description: 'Ikkita darsni bir kunda yakunlang',
    reward: 200,
    icon: 'trophy',
    color: '#f59e0b',
    progress: 0,
    target: 2,
    status: 'not_started',
  },
  {
    _id: 'streak',
    title: 'Streak\'ni saqlash',
    description: 'Bugun ham ilovaga kiring va streak\'ni davom ettiring',
    reward: 50,
    icon: 'flame',
    color: '#ef4444',
    progress: 1,
    target: 1,
    status: 'done',
  },
  {
    _id: 'playground',
    title: 'Kod yozish',
    description: 'Playground\'da bitta loyiha yarating',
    reward: 100,
    icon: 'code-slash',
    color: '#0ea5e9',
    progress: 0,
    target: 1,
    status: 'not_started',
  },
  {
    _id: 'quiz',
    title: 'Quiz yechish',
    description: 'Bitta videodan keyingi testni to\'g\'ri yeching',
    reward: 50,
    icon: 'checkbox',
    color: '#a855f7',
    progress: 0,
    target: 1,
    status: 'not_started',
  },
];

type Status = 'done' | 'in_progress' | 'not_started';

const STATUS_META: Record<Status, { label: string; color: string; icon: string }> = {
  done: { label: 'Bajarildi', color: '#10b981', icon: 'checkmark-circle' },
  in_progress: { label: 'Jarayonda', color: '#f59e0b', icon: 'time' },
  not_started: { label: 'Boshlanmagan', color: '#64748b', icon: 'ellipse-outline' },
};

const DailyChallengeScreen = ({ navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayChallenges, totalReward, earnedReward, loading, error } = useAppSelector(
    (s) => s.challenge
  );
  const [refreshing, setRefreshing] = React.useState(false);

  // Backend challengelar bo'lsa ularni, bo'lmasa static'ni ko'rsatamiz
  const challenges = todayChallenges.length > 0 ? todayChallenges : STATIC_CHALLENGES;
  const displayTotal = todayChallenges.length > 0 ? totalReward : STATIC_CHALLENGES.reduce((s, c) => s + c.reward, 0);
  const displayEarned = todayChallenges.length > 0 ? earnedReward : STATIC_CHALLENGES.filter((c) => c.status === 'done').reduce((s, c) => s + c.reward, 0);
  const doneCount = challenges.filter((c) => c.status === 'done').length;

  const load = useCallback(
    async (opts?: { refresh?: boolean }) => {
      if (opts?.refresh) setRefreshing(true);
      // Avval bugungi challengelarni, keyin progressni olamiz
      await dispatch(fetchTodayChallenges());
      await dispatch(fetchChallengeProgress());
      setRefreshing(false);
    },
    [dispatch]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const close = () => {
    triggerHaptic('light');
    navigation.goBack();
  };

  const renderChallenge = (c: Challenge, index: number) => {
    const status = STATUS_META[c.status as Status] ?? STATUS_META.not_started;
    const pct = c.target > 0 ? Math.min(100, Math.round((c.progress / c.target) * 100)) : 0;

    return (
      <FadeInView key={c._id} delay={index * 70}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: c.status === 'done' ? colors.success + '40' : colors.border,
              borderRadius: radii.lg,
              padding: spacing.lg,
              marginBottom: spacing.md,
              opacity: c.status === 'done' ? 0.85 : 1,
            },
          ]}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: (c.color || colors.primary) + '20', borderRadius: radii.md }]}>
              <Ionicons name={(c.icon as any) || 'star'} size={22} color={c.color || '#6366f1'} />
            </View>
            <View style={styles.cardMeta}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                {c.title}
              </Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {c.description}
              </Text>
            </View>
            <View style={styles.rewardBox}>
              <Ionicons name="flash" size={14} color={c.color || '#f59e0b'} />
              <Text style={[styles.rewardText, { color: c.color || '#f59e0b' }]}>+{c.reward}</Text>
            </View>
          </View>

          <ProgressBar
            progress={pct}
            color={c.status === 'done' ? colors.success : (c.color || colors.primary)}
            delay={index * 70 + 200}
            style={{ marginTop: spacing.md }}
          />

          <View style={[styles.statusRow, { marginTop: spacing.sm }]}>
            <View style={styles.statusLeft}>
              <Ionicons name={status.icon as any} size={14} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {c.progress}/{c.target}
            </Text>
          </View>
        </View>
      </FadeInView>
    );
  };

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <TouchableOpacity onPress={close} style={[styles.closeBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bugungi Challengelar</Text>
        <View style={styles.closeBtn} />
      </View>

      {loading && challenges.length === 0 ? (
        <View style={styles.loadingBox}>
          <Loader size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load({ refresh: true })}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <GradientCard variant="brand" style={styles.summary}>
            <View>
              <Text style={styles.summaryLabel}>Mavjud mukofot</Text>
              <Text style={styles.summaryValue}>+{displayTotal} XP</Text>
              <Text style={styles.summarySub}>
                {doneCount}/{challenges.length} bajarildi · {displayEarned} XP olindi
              </Text>
            </View>
            <Ionicons name="gift" size={56} color="rgba(255,255,255,0.4)" />
          </GradientCard>

          <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: spacing.xl }]}>
            Sizning XP balansingiz
          </Text>
          <View
            style={[
              styles.balanceCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg },
            ]}
          >
            <Ionicons name="flash" size={20} color={colors.accent ?? '#f59e0b'} />
            <Text style={[styles.balanceText, { color: colors.text }]}>
              {(user?.xp ?? 0).toLocaleString()} XP
            </Text>
            <Text style={[styles.balanceSub, { color: colors.textSecondary }]}>
              ({user?.streak ?? 0} kunlik streak)
            </Text>
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.textSecondary, marginTop: spacing.sm }]}>
              ⚠ Backend bilan bog'lanib bo'lmadi — namuna ko'rsatilmoqda
            </Text>
          ) : null}

          <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: spacing.xl }]}>
            Challengelar ({challenges.length})
          </Text>
          <View style={{ marginTop: spacing.md }}>{challenges.map((c, i) => renderChallenge(c, i))}</View>

          <View
            style={[
              styles.footer,
              { borderColor: colors.border, marginTop: spacing.lg, padding: spacing.lg },
            ]}
          >
            <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Challengelar har kuni yangilanadi. Ertaga yangi mukofotlar bilan qaytib keling!
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summary: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  summaryLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 4 },
  summarySub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  balanceText: { fontSize: 18, fontWeight: '700' },
  balanceSub: { fontSize: 13, marginLeft: 'auto' },
  errorText: { fontSize: 12, textAlign: 'center', fontStyle: 'italic' },
  card: { borderRadius: 16, borderWidth: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 12, marginTop: 2 },
  rewardBox: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rewardText: { fontSize: 14, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  progressText: { fontSize: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  footerText: { flex: 1, fontSize: 12, lineHeight: 18 },
});

export default DailyChallengeScreen;
