import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchMyFollowers,
    fetchMyFollowing,
    FollowUser,
    toggleFollow,
} from '../../store/slices/followSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

type TabKey = 'followers' | 'following';

const FollowScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();

  const initialTab: TabKey = route.params?.tab ?? 'followers';
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [refreshing, setRefreshing] = useState(false);

  const { followers, following, followingIds, loading } = useAppSelector((s) => s.follow);

  const load = useCallback(
    async (opts?: { refresh?: boolean }) => {
      if (opts?.refresh) setRefreshing(true);
      await Promise.all([dispatch(fetchMyFollowers()), dispatch(fetchMyFollowing())]);
      setRefreshing(false);
    },
    [dispatch]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleToggleFollow = (userId: string) => {
    triggerHaptic('light');
    dispatch(toggleFollow({ userId }));
  };

  const data: FollowUser[] = tab === 'followers' ? followers : following;

  const renderItem = ({ item, index }: { item: FollowUser; index: number }) => {
    const isFollowing = followingIds.includes(item._id);
    return (
      <FadeInView delay={index * 60}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              padding: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={[styles.avatarLetter, { color: colors.primary }]}>
                {item.firstName?.[0] || item.username?.[0] || '?'}
              </Text>
            )}
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{item.username}
            </Text>
            {item.rankTitle ? (
              <Text style={[styles.rank, { color: colors.primary }]}>{item.rankTitle}</Text>
            ) : null}
          </View>
          <AnimatedPressable
            style={[
              styles.followBtn,
              {
                backgroundColor: isFollowing ? colors.card : colors.primary,
                borderColor: isFollowing ? colors.border : colors.primary,
              },
            ]}
            onPress={() => handleToggleFollow(item._id)}
            scaleDown={0.92}
          >
            <Text
              style={[
                styles.followBtnText,
                { color: isFollowing ? colors.textSecondary : '#ffffff' },
              ]}
            >
              {isFollowing ? 'Kuzatilmoqda' : 'Kuzatish'}
            </Text>
          </AnimatedPressable>
        </View>
      </FadeInView>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ padding: spacing.xl }}>
          <CardSkeleton variant="list" count={6} />
        </View>
      );
    }
    return (
      <View style={[styles.empty, { padding: spacing.xxl }]}>
        <Ionicons name="people-outline" size={56} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text, marginTop: spacing.md }]}>
          {tab === 'followers' ? 'Hali follower yo\'q' : 'Hali hech kimni kuzatmayapsiz'}
        </Text>
      </View>
    );
  };

  const TabBtn = ({ value, label }: { value: TabKey; label: string }) => {
    const active = tab === value;
    return (
      <TouchableOpacity
        onPress={() => {
          triggerHaptic('light');
          setTab(value);
        }}
        style={[
          styles.tab,
          {
            backgroundColor: active ? colors.primary : colors.card,
            borderColor: active ? colors.primary : colors.border,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <Text
          style={{
            color: active ? '#ffffff' : colors.textSecondary,
            fontWeight: active ? typography.weights.bold : typography.weights.medium,
            fontSize: typography.sizes.sm,
          }}
        >
          {label} · {value === 'followers' ? followers.length : following.length}
        </Text>
      </TouchableOpacity>
    );
  };

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
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.sizes.xxl, marginLeft: spacing.md },
          ]}
        >
          Ijtimoiy tarmoq
        </Text>
      </View>

      <View style={[styles.tabs, { paddingHorizontal: spacing.xl, marginTop: spacing.md }]}>
        <TabBtn value="followers" label="Followerlar" />
        <View style={{ width: spacing.sm }} />
        <TabBtn value="following" label="Kuzatilayotganlar" />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.xl, flexGrow: 1 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load({ refresh: true })}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  title: { fontWeight: '700' },
  tabs: { flexDirection: 'row' },
  tab: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, borderWidth: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  avatarLetter: { fontSize: 20, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700' },
  username: { fontSize: 12, marginTop: 2 },
  rank: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  followBtn: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  followBtnText: { fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});

export default FollowScreen;
