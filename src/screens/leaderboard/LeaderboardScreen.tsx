import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRanking } from '../../store/slices/rankingSlice';
import { Ionicons } from '@expo/vector-icons';

const LeaderboardScreen = () => {
  const { colors, spacing } = useTheme();
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.ranking);

  useEffect(() => {
    dispatch(fetchRanking({}));
  }, [dispatch]);

  const renderItem = ({ item, index }: any) => {
    const nestedUser = item.user ?? {};
    const firstName = nestedUser.firstName ?? item.firstName ?? '';
    const lastName = nestedUser.lastName ?? item.lastName ?? '';
    const username = nestedUser.username ?? item.username ?? '';
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || username || 'Foydalanuvchi';
    const initial = (displayName[0] || '?').toUpperCase();
    const rankTitle = item.rankTitle ?? nestedUser.rankTitle ?? '';
    const xp = item.xp ?? nestedUser.xp ?? 0;

    return (
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rank, { color: colors.textSecondary }]}>{item.rank ?? index + 1}</Text>
        <View style={styles.userInfo}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
            <Text style={{ color: colors.primary }}>{initial}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
            {!!rankTitle && (
              <Text style={[styles.userRank, { color: colors.textSecondary }]}>{rankTitle}</Text>
            )}
          </View>
        </View>
        <Text style={[styles.xp, { color: colors.primary }]}>{xp} XP</Text>
      </View>
    );
  };

  const keyExtractor = (item: any, index: number) => {
    const id = item?.user?._id ?? item?._id ?? item?.user?.username ?? item?.username;
    return id ? String(id) : `row-${index}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#fff' }]}>Reyting</Text>
        <View style={styles.podium}>
          <Text style={{ color: '#fff' }}>Haftalik eng kuchlilar</Text>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  podium: {
    marginTop: 20,
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userRank: {
    fontSize: 12,
  },
  xp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
