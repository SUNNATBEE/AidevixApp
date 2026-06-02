import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { fetchTopCourses } from '../../store/slices/courseSlice';
import CourseCard from '../../components/course/CourseCard';
import ActivityFeed from '../../components/home/ActivityFeed';
import StreakCounter from '../../components/gamification/StreakCounter';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const HomeScreen = ({ navigation }: any) => {
  const { colors, spacing } = useTheme();
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
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={[styles.header, { padding: spacing.xl, paddingBottom: 0 }]}>
        <View>
          <Text style={[styles.welcome, { color: colors.textSecondary }]}>Xush kelibsiz,</Text>
          <Text style={[styles.name, { color: colors.text }]}>{user?.firstName || 'O\'quvchi'} 👋</Text>
        </View>
        <TouchableOpacity 
          style={[styles.streakContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <StreakCounter count={user?.streak || 0} />
          <View style={styles.divider} />
          <View style={styles.xpBox}>
            <Ionicons name="flash" size={16} color={colors.accent} />
            <Text style={[styles.xpText, { color: colors.text }]}>{user?.xp || 0} XP</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <ActionIcon name="time" label="Pomodoro" onPress={() => navigation.navigate('FocusMode')} color="#6366f1" />
        <ActionIcon name="code-slash" label="Editor" onPress={() => navigation.navigate('Playground')} color="#10b981" />
        <ActionIcon name="play-circle" label="Shorts" onPress={() => navigation.navigate('Shorts')} color="#e1306c" />
        <ActionIcon name="qr-code" label="Scan" onPress={() => {}} color="#f59e0b" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bugungi Challenge</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DailyChallenge')}>
            <Text style={{ color: colors.primary }}>Hammasi</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.challengeCard, { backgroundColor: colors.primary }]}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>1ta dars ko'rish</Text>
            <Text style={styles.challengeReward}>+100 XP mukofot</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
          </View>
          <Ionicons name="gift" size={44} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.challengeCard, styles.challengeCardSecondary, { backgroundColor: colors.accent ?? '#f59e0b' }]}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>Kamida 2ta dars ko'rish</Text>
            <Text style={styles.challengeReward}>+200 XP mukofot</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
          </View>
          <Ionicons name="trophy" size={44} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mashhur Kurslar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CoursesStack')}>
            <Text style={{ color: colors.primary }}>Barchasi</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
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
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        )}
      </View>

      <ActivityFeed />
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const ActionIcon = ({ name, label, onPress, color }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionBadge, { backgroundColor: color + '15' }]}>
      <Ionicons name={name} size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  xpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  xpText: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 15,
    backgroundColor: 'rgba(128,128,128,0.3)',
    marginHorizontal: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  challengeCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  challengeCardSecondary: {
    marginTop: 12,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 20,
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeReward: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
});

export default HomeScreen;
