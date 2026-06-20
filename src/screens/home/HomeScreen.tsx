import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedPressable from '../../components/common/AnimatedPressable';
import FadeInView from '../../components/common/FadeInView';
import GradientCard from '../../components/common/GradientCard';
import IconBadge from '../../components/common/IconBadge';
import ProgressBar from '../../components/common/ProgressBar';
import Screen from '../../components/common/Screen';
import SectionHeader from '../../components/common/SectionHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ActivityFeed from '../../components/home/ActivityFeed';
import CourseCard from '../../components/course/CourseCard';
import StreakCounter from '../../components/gamification/StreakCounter';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTopCourses } from '../../store/slices/courseSlice';
import { useTheme } from '../../theme';

const HomeScreen = ({ navigation }: any) => {
  const { colors, spacing, radii, typography } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { topCourses, loading } = useAppSelector((state) => state.course);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(fetchTopCourses());
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchTopCourses()).finally(() => setRefreshing(false));
  }, [dispatch]);

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh} padded={false}>
      {/* Header */}
      <FadeInView delay={0}>
        <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.welcome, { color: colors.textSecondary }]}>Xush kelibsiz,</Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.firstName || 'O\'quvchi'} 👋
            </Text>
          </View>
          <AnimatedPressable
            onPress={() => navigation.navigate('Leaderboard')}
            style={[
              styles.streakContainer,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.pill },
            ]}
          >
            <StreakCounter count={user?.streak || 0} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.xpBox}>
              <Ionicons name="flash" size={16} color={colors.accent} />
              <Text style={[styles.xpText, { color: colors.text }]}>{user?.xp || 0} XP</Text>
            </View>
          </AnimatedPressable>
        </View>
      </FadeInView>

      {/* Quick actions */}
      <FadeInView delay={60}>
        <View style={styles.quickActions}>
          <ActionIcon name="code-slash" label="Editor" onPress={() => navigation.navigate('Playground')} color={colors.primary} />
          <ActionIcon name="play-circle" label="Shorts" onPress={() => navigation.navigate('Shorts')} color={colors.secondary} />
          <ActionIcon name="people" label="Asoschilar" onPress={() => navigation.navigate('Founders')} color={colors.accent} />
        </View>
      </FadeInView>

      {/* Today's challenge */}
      <FadeInView delay={120}>
        <View style={[styles.section, { paddingHorizontal: spacing.xl }]}>
          <SectionHeader
            title="Bugungi Sinov"
            actionLabel="Hammasi"
            onActionPress={() => navigation.navigate('DailyChallenge')}
          />

          <GradientCard variant="brand" onPress={() => navigation.navigate('DailyChallenge')} style={styles.challengeCard}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>1ta dars ko'rish</Text>
              <Text style={styles.challengeReward}>+100 XP mukofot</Text>
              <ProgressBar progress={40} color="#fff" trackColor="rgba(255,255,255,0.25)" style={{ marginTop: spacing.md }} />
            </View>
            <Ionicons name="gift" size={44} color="rgba(255,255,255,0.45)" />
          </GradientCard>

          <GradientCard variant="accent" onPress={() => navigation.navigate('DailyChallenge')} style={[styles.challengeCard, { marginTop: spacing.md }]}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Kamida 2ta dars ko'rish</Text>
              <Text style={styles.challengeReward}>+200 XP mukofot</Text>
              <ProgressBar progress={0} color="#fff" trackColor="rgba(255,255,255,0.25)" style={{ marginTop: spacing.md }} />
            </View>
            <Ionicons name="trophy" size={44} color="rgba(255,255,255,0.45)" />
          </GradientCard>
        </View>
      </FadeInView>

      {/* Popular courses */}
      <FadeInView delay={180}>
        <View style={styles.section}>
          <View style={{ paddingHorizontal: spacing.xl }}>
            <SectionHeader
              title="Mashhur Kurslar"
              actionLabel="Barchasi"
              onActionPress={() => navigation.navigate('CoursesStack')}
            />
          </View>
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.xl }}>
              <SkeletonLoader width={280} height={180} />
              <View style={{ width: 16 }} />
              <SkeletonLoader width={280} height={180} />
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={topCourses}
              renderItem={({ item }) => (
                <CourseCard
                  course={item}
                  horizontal
                  onPress={(id) => navigation.navigate('CoursesStack', { screen: 'CourseDetail', params: { courseId: id } })}
                />
              )}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingHorizontal: spacing.xl }}
            />
          )}
        </View>
      </FadeInView>

      <FadeInView delay={240}>
        <ActivityFeed />
      </FadeInView>
    </Screen>
  );
};

const ActionIcon = ({ name, label, onPress, color }: any) => {
  const { colors } = useTheme();
  return (
    <AnimatedPressable onPress={onPress} style={styles.actionItem}>
      <IconBadge name={name} color={color} size={54} iconSize={24} />
      <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  welcome: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: '800' },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  xpBox: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
  xpText: { marginLeft: 4, fontWeight: '600', fontSize: 14 },
  divider: { width: 1, height: 15, marginHorizontal: 8 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  actionItem: { alignItems: 'center', width: 72, gap: 8 },
  actionLabel: { fontSize: 12, fontWeight: '500' },
  section: { marginBottom: 24 },
  challengeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeInfo: { flex: 1, marginRight: 20 },
  challengeTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  challengeReward: { color: 'rgba(255,255,255,0.85)', marginTop: 4, fontSize: 13 },
});

export default HomeScreen;
