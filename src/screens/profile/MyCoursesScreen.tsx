import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { Course } from '../../types/course';
import { xpApi } from '../../api/xpApi';
import { courseApi } from '../../api/courseApi';
import CourseCard from '../../components/course/CourseCard';
import FadeInView from '../../components/common/FadeInView';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { triggerHaptic } from '../../utils/haptics';

type TabKey = 'recent' | 'downloaded';

// xp/history dan kelgan turli shape'larni bitta course id ro'yxatiga keltiramiz.
// Backend ba'zan {course:{_id}}, ba'zan {courseId}, ba'zan {video:{course:id}} qaytaradi.
const extractCourseIds = (history: any[]): string[] => {
  const ids = new Set<string>();
  for (const entry of history ?? []) {
    if (!entry || typeof entry !== 'object') continue;
    const cid =
      entry?.course?._id ??
      entry?.course ??
      entry?.courseId ??
      entry?.video?.course?._id ??
      entry?.video?.course;
    if (typeof cid === 'string' && cid.length > 0) ids.add(cid);
  }
  return Array.from(ids);
};

const MyCoursesScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const navigation = useNavigation<any>();
  const downloadedCourses = useAppSelector((s) => s.offline.downloadedCourses);

  const [tab, setTab] = useState<TabKey>('recent');
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deps bo'sh — function identity barqaror. Aks holda har safar recentCourses
  // o'zgarganda loadRecent identity o'zgarib, useFocusEffect tinmay qayta ishga tushardi.
  const loadRecent = useCallback(async (opts?: { refresh?: boolean }) => {
    try {
      setError(null);
      if (!opts?.refresh) setLoading(true);
      const histResp = await xpApi.getHistory();
      const root = histResp.data?.data ?? histResp.data ?? {};
      const items: any[] = Array.isArray(root)
        ? root
        : root?.history ?? root?.activity ?? root?.items ?? [];
      const ids = extractCourseIds(items).slice(0, 20);

      // Har bir kurs uchun detallarni parallel olamiz; yiqilganlarini o'tkazib yuboramiz.
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const r = await courseApi.getCourseById(id);
            return (r.data?.data?.course ?? r.data?.course ?? r.data ?? null) as Course | null;
          } catch {
            return null;
          }
        })
      );
      setRecentCourses(results.filter((c): c is Course => !!c && !!c._id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Kurslarni yuklab bo\'lmadi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [loadRecent])
  );

  // Foydalanuvchida hech narsa downloadlanmagan bo'lsa, recent tab default bo'ladi (allaqachon shunday).
  // Lekin agar recent bo'sh-u, downloaded mavjud bo'lsa, default downloaded ga o'tkazamiz.
  useEffect(() => {
    if (recentCourses.length === 0 && downloadedCourses.length > 0 && tab === 'recent' && !loading) {
      setTab('downloaded');
    }
  }, [recentCourses.length, downloadedCourses.length, loading, tab]);

  const visible = tab === 'recent' ? recentCourses : downloadedCourses;

  const handleTabChange = (next: TabKey) => {
    if (next === tab) return;
    triggerHaptic('light');
    setTab(next);
  };

  const handleRefresh = () => {
    triggerHaptic('light');
    setRefreshing(true);
    loadRecent({ refresh: true });
  };

  const openCourse = (courseId: string) => {
    triggerHaptic('light');
    // CourseDetail CoursesStack ichida — parent (MainTabs) orqali o'tamiz.
    navigation.navigate('CoursesStack', {
      screen: 'CourseDetail',
      params: { courseId },
    });
  };

  const goBrowse = () => {
    triggerHaptic('light');
    navigation.navigate('CoursesStack', { screen: 'Courses' });
  };

  const renderItem: ListRenderItem<Course> = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(14)}
      style={{ width: '48%' }}
    >
      <CourseCard course={item} onPress={openCourse} />
    </Animated.View>
  );

  const renderSkeleton = () => (
    <View style={[styles.skeletonGrid, { padding: spacing.lg }]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={i}
          style={{
            width: '48%',
            marginBottom: spacing.md,
          }}
        >
          <SkeletonLoader height={200} borderRadius={radii.lg} />
        </View>
      ))}
    </View>
  );

  const renderEmpty = () => {
    if (loading && tab === 'recent') return renderSkeleton();
    const isDownloaded = tab === 'downloaded';
    return (
      <View style={[styles.empty, { padding: spacing.xxl }]}>
        <Ionicons
          name={isDownloaded ? 'cloud-download-outline' : 'book-outline'}
          size={56}
          color={colors.textSecondary}
        />
        <Text
          style={[
            styles.emptyTitle,
            { color: colors.text, marginTop: spacing.md, fontSize: typography.sizes.lg },
          ]}
        >
          {error
            ? error
            : isDownloaded
            ? 'Yuklab olingan kurs yo\'q'
            : 'Hali kurs boshlamadingiz'}
        </Text>
        <Text
          style={[
            styles.emptySubtitle,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              fontSize: typography.sizes.sm,
            },
          ]}
        >
          {isDownloaded
            ? 'Internet bo\'lmaganda ko\'rish uchun kursni yuklab oling'
            : 'Kurslar bo\'limidan birinchi darsni tanlang'}
        </Text>
        <TouchableOpacity
          style={[
            styles.browseBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.md,
              marginTop: spacing.lg,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xl,
            },
          ]}
          onPress={goBrowse}
          activeOpacity={0.85}
        >
          <Ionicons name="library-outline" size={18} color="#ffffff" />
          <Text style={[styles.browseBtnText, { marginLeft: 8 }]}>Kurslarni ko'rish</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const TabButton = ({
    label,
    value,
    count,
    icon,
  }: {
    label: string;
    value: TabKey;
    count: number;
    icon: keyof typeof Ionicons.glyphMap;
  }) => {
    const active = tab === value;
    return (
      <Pressable
        onPress={() => handleTabChange(value)}
        style={[
          styles.tab,
          {
            backgroundColor: active ? colors.primary : colors.card,
            borderColor: active ? colors.primary : colors.border,
            borderRadius: radii.pill,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={active ? '#ffffff' : colors.textSecondary}
        />
        <Text
          style={{
            marginLeft: 6,
            color: active ? '#ffffff' : colors.textSecondary,
            fontWeight: active ? typography.weights.bold : typography.weights.medium,
            fontSize: typography.sizes.sm,
          }}
        >
          {label}
          {count > 0 ? ` · ${count}` : ''}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <FadeInView style={[styles.header, { paddingHorizontal: spacing.xl }]}>
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
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.sizes.xxl, marginLeft: spacing.md },
          ]}
        >
          Mening kurslarim
        </Text>
      </FadeInView>

      <View style={[styles.tabsRow, { paddingHorizontal: spacing.xl, marginTop: spacing.md }]}>
        <TabButton
          label="So'nggi"
          value="recent"
          count={recentCourses.length}
          icon="time-outline"
        />
        <View style={{ width: spacing.sm }} />
        <TabButton
          label="Yuklab olingan"
          value="downloaded"
          count={downloadedCourses.length}
          icon="cloud-download-outline"
        />
      </View>

      <FlatList
        data={visible}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={visible.length > 0 ? styles.columnWrapper : undefined}
        contentContainerStyle={{
          padding: spacing.lg,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          tab === 'recent' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
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
  title: { fontWeight: '700' },
  tabsRow: { flexDirection: 'row' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  columnWrapper: { justifyContent: 'space-between' },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontWeight: '600', textAlign: 'center' },
  emptySubtitle: { textAlign: 'center' },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  browseBtnText: { color: '#ffffff', fontWeight: '700' },
});

export default MyCoursesScreen;
