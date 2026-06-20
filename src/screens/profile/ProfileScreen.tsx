import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

const ProfileScreen = ({ navigation }: any) => {
  const { colors, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const goEdit = () => {
    triggerHaptic('light');
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    triggerHaptic('warning');
    dispatch(logout());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.profileInfo}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primarySoft }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {user?.firstName?.[0] || 'U'}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}
              onPress={goEdit}
              hitSlop={8}
            >
              <Ionicons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
          <View style={[styles.rankBadge, { backgroundColor: colors.primarySoft, borderRadius: radii.md }]}>
            <Text style={[styles.rankText, { color: colors.primary }]}>
              {user?.rankTitle || 'AMATEUR'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.xp || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.streak || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Kun
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem
          icon="person-circle-outline"
          title="Profilni tahrirlash"
          onPress={goEdit}
          colors={colors}
        />
        <MenuItem
          icon="book"
          title="Mening kurslarim"
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('MyCourses');
          }}
          colors={colors}
        />
        <MenuItem
          icon="ribbon-outline"
          title="Sertifikatlarim"
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Certificates');
          }}
          colors={colors}
        />
        <MenuItem
          icon="people-outline"
          title="Followerlar"
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Follow', { tab: 'followers' });
          }}
          colors={colors}
        />
        <MenuItem
          icon="gift-outline"
          title="Do'st taklif qilish"
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Referrals');
          }}
          colors={colors}
        />
        <MenuItem
          icon="settings-outline"
          title="Sozlamalar"
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Settings');
          }}
          colors={colors}
        />
        <MenuItem
          icon="log-out-outline"
          title="Chiqish"
          onPress={handleLogout}
          colors={colors}
          isDanger
        />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, title, onPress, colors, isDanger }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, { borderBottomColor: colors.border }]}
    onPress={onPress}
  >
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={24} color={isDanger ? colors.error : colors.text} />
      <Text style={[styles.menuItemTitle, { color: isDanger ? colors.error : colors.text }]}>
        {title}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  menu: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ProfileScreen;
