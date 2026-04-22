import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const ActivityFeed = () => {
  const { colors, spacing } = useTheme();

  const activities = [
    { id: '1', user: 'Jasurbek', action: '5-levelga chiqdi!', time: '2 soat avval', icon: 'trending-up', color: '#10b981' },
    { id: '2', user: 'Nodira', action: 'yangi prompt yaratdi', time: '5 soat avval', icon: 'flash', color: '#6366f1' },
    { id: '3', user: 'Anvar', action: 'HTML kursini tugatdi', time: '1 kun avval', icon: 'ribbon', color: '#f59e0b' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text, marginHorizontal: spacing.xl }]}>
        Ijtimoiy faollik
      </Text>
      <View style={styles.list}>
        {activities.map((item) => (
          <View key={item.id} style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.activityText, { color: colors.text }]}>
                <Text style={styles.userName}>{item.user}</Text> {item.action}
              </Text>
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  timeText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ActivityFeed;
