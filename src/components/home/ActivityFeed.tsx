import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { rankingApi } from '../../api/rankingApi';
import SkeletonLoader from '../common/SkeletonLoader';
import Card from '../common/Card';
import IconBadge from '../common/IconBadge';
import FadeInView from '../common/FadeInView';
import { RANKS } from '../../utils/constants';

const safeText = (v: any, fallback = ''): string => {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    return v.name ?? v.title ?? v.username ?? v.firstName ?? fallback;
  }
  return String(v);
};

const safeNumber = (v: any, fallback = 0): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

interface FeedItem {
  id: string;
  user: string;
  action: string;
  icon: string;
  color: string;
}

const rankFromXp = (xp: number): { label: string; color: string } => {
  if (xp >= RANKS.LEGEND) return { label: 'Legend', color: '#a855f7' };
  if (xp >= RANKS.MASTER) return { label: 'Master', color: '#ef4444' };
  if (xp >= RANKS.SENIOR) return { label: 'Senior', color: '#f59e0b' };
  if (xp >= RANKS.MIDDLE) return { label: 'Middle', color: '#10b981' };
  if (xp >= RANKS.JUNIOR) return { label: 'Junior', color: '#6366f1' };
  if (xp >= RANKS.CANDIDATE) return { label: 'Candidate', color: '#0ea5e9' };
  return { label: 'Amateur', color: '#64748b' };
};

const buildFeedItem = (raw: any, index: number): FeedItem => {
  const username =
    safeText(raw?.username) ||
    safeText(raw?.firstName) ||
    safeText(raw?.name) ||
    'O\'quvchi';
  const xp = safeNumber(raw?.xp);
  const streak = safeNumber(raw?.streak);
  const rank = rankFromXp(xp);

  let action: string;
  let icon: string;

  if (index === 0) {
    action = `reyting peshqadami · ${xp.toLocaleString()} XP`;
    icon = 'trophy';
  } else if (streak >= 7) {
    action = `${streak} kun ketma-ket o'qiyapti`;
    icon = 'flame';
  } else if (xp >= RANKS.JUNIOR) {
    action = `${rank.label} darajasiga yetdi`;
    icon = 'trending-up';
  } else {
    action = `${xp.toLocaleString()} XP to'pladi`;
    icon = 'flash';
  }

  return {
    id: safeText(raw?._id) || `user-${index}`,
    user: username,
    action,
    icon,
    color: rank.color,
  };
};

const ActivityFeed = () => {
  const { colors, spacing } = useTheme();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rankingApi.getTopUsers({ limit: 5 });
      const raw = res.data?.data?.users ?? res.data?.users ?? res.data?.data ?? res.data ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setItems(list.slice(0, 5).map(buildFeedItem));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Yuklab bo\'lmadi');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { marginHorizontal: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Ijtimoiy faollik</Text>
        {!loading && !error && items.length > 0 && (
          <TouchableOpacity onPress={load}>
            <Ionicons name="refresh" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <SkeletonLoader height={64} borderRadius={16} />
              </View>
            ))}
          </>
        )}

        {!loading && error && (
          <View style={[styles.stateBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="cloud-offline-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>
              Faollikni yuklab bo'lmadi
            </Text>
            <TouchableOpacity onPress={load} style={styles.retryBtn}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Qayta urinish</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && items.length === 0 && (
          <View style={[styles.stateBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>
              Hozircha faollik yo'q
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          items.map((item, i) => (
            <FadeInView key={item.id} delay={i * 60} style={{ marginBottom: 12 }}>
              <Card style={styles.item}>
                <IconBadge name={item.icon as any} color={item.color} size={40} iconSize={20} />
                <View style={styles.textContainer}>
                  <Text style={[styles.activityText, { color: colors.text }]} numberOfLines={2}>
                    <Text style={styles.userName}>{item.user}</Text> {item.action}
                  </Text>
                </View>
              </Card>
            </FadeInView>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  activityText: {
    fontSize: 14,
  },
  stateBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  stateText: {
    fontSize: 14,
  },
  retryBtn: {
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ActivityFeed;
