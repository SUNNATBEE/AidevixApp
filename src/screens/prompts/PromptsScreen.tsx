import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPrompts,
  toggleLikePrompt,
  setFilter,
  setRefreshing,
  PromptFilter,
  Prompt,
} from '../../store/slices/promptSlice';
import { triggerHaptic } from '../../utils/haptics';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const isPromptLiked = (p: Prompt, userId?: string): boolean => {
  if (typeof p.isLiked === 'boolean') return p.isLiked;
  if (!userId) return false;
  return Array.isArray(p.likes) && p.likes.includes(userId);
};

const PromptsScreen = ({ navigation }: any) => {
  const { colors, spacing, typography } = useTheme();
  const dispatch = useAppDispatch();
  const { prompts, loading, refreshing, filter } = useAppSelector((state) => state.prompt);
  const currentUser = useAppSelector((state) => state.auth.user);

  const loadData = useCallback(() => {
    dispatch(fetchPrompts({}));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const visiblePrompts = useMemo(() => {
    if (filter === 'liked') {
      return prompts.filter((p) => isPromptLiked(p, currentUser?.id));
    }
    return prompts;
  }, [prompts, filter, currentUser?.id]);

  const handleFilterChange = (next: PromptFilter) => {
    if (next === filter) return;
    triggerHaptic('light');
    dispatch(setFilter(next));
  };

  const handleRefresh = () => {
    triggerHaptic('light');
    dispatch(setRefreshing(true));
    loadData();
  };

  const handleToggleLike = (promptId: string) => {
    triggerHaptic('medium');
    dispatch(toggleLikePrompt({ promptId, userId: currentUser?.id }));
  };

  const renderItem: ListRenderItem<Prompt> = ({ item }) => {
    const liked = isPromptLiked(item, currentUser?.id);
    const count = item.likesCount ?? item.likes?.length ?? 0;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            padding: spacing.lg,
            marginBottom: spacing.lg,
          },
        ]}
        onPress={() => navigation.navigate('PromptDetail', { promptId: item._id })}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              color: colors.text,
              fontSize: typography.sizes.lg,
              marginBottom: spacing.sm,
            },
          ]}
        >
          {item.title}
        </Text>
        {!!item.description && (
          <Text
            style={[
              styles.cardDesc,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                marginBottom: spacing.md,
              },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
        <View style={styles.cardFooter}>
          {!!item.category && (
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {item.category}
              </Text>
            </View>
          )}
          <Pressable
            onPress={() => handleToggleLike(item._id)}
            hitSlop={10}
            style={({ pressed }) => [
              styles.likeBtn,
              { opacity: pressed ? 0.6 : 1, marginLeft: 'auto' },
            ]}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? colors.error : colors.textSecondary}
            />
            <Text
              style={{
                color: liked ? colors.error : colors.textSecondary,
                marginLeft: 4,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.semibold,
              }}
            >
              {count}
            </Text>
          </Pressable>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <View style={{ paddingTop: spacing.sm }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={{ marginBottom: spacing.lg }}>
          <SkeletonLoader height={120} borderRadius={16} />
        </View>
      ))}
    </View>
  );

  const renderEmpty = () => {
    if (loading) return renderSkeleton();
    const isLikedFilter = filter === 'liked';
    return (
      <View style={[styles.empty, { padding: spacing.xxl }]}>
        <Ionicons
          name={isLikedFilter ? 'heart-outline' : 'flash-outline'}
          size={56}
          color={colors.textSecondary}
        />
        <Text
          style={[
            styles.emptyText,
            {
              color: colors.text,
              marginTop: spacing.md,
              fontSize: typography.sizes.lg,
            },
          ]}
        >
          {isLikedFilter ? 'Sevimli promptlar yo\'q' : 'Promptlar topilmadi'}
        </Text>
        <Text
          style={[
            styles.emptySubtext,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              fontSize: typography.sizes.sm,
            },
          ]}
        >
          {isLikedFilter
            ? 'Yoqqan promptlaringizga yurak bosing'
            : 'Tez orada yangi promptlar qo\'shiladi'}
        </Text>
      </View>
    );
  };

  const FilterTab = ({ label, value, icon }: { label: string; value: PromptFilter; icon: keyof typeof Ionicons.glyphMap }) => {
    const active = filter === value;
    return (
      <Pressable
        onPress={() => handleFilterChange(value)}
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
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xxl }]}>
          Promptlar
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => triggerHaptic('light')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.filterRow, { paddingHorizontal: spacing.xl, marginTop: spacing.md }]}>
        <FilterTab label="Hammasi" value="all" icon="apps-outline" />
        <View style={{ width: spacing.sm }} />
        <FilterTab label="Sevimlilar" value="liked" icon="heart" />
      </View>

      <FlatList
        data={visiblePrompts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.xl, flexGrow: 1 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: '700' },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: { flexDirection: 'row' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: { fontWeight: '600' },
  cardDesc: {},
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  empty: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  emptyText: { fontWeight: '600', textAlign: 'center' },
  emptySubtext: { textAlign: 'center' },
});

export default PromptsScreen;
