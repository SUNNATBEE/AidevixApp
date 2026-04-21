import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }: any) => {
  const { colors, spacing } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.profileInfo}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {user?.firstName?.[0] || 'U'}
              </Text>
            )}
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.firstName} {user?.lastName}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
          <View style={[styles.rankBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.rankText, { color: colors.primary }]}>{user?.rankTitle || 'AMATEUR'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.xp || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.streak || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Kun</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem 
          icon="book" 
          title="Mening kurslarim" 
          onPress={() => navigation.navigate('MyCourses')} 
          colors={colors} 
        />
        <MenuItem 
          icon="ribbon" 
          title="Sertifikatlar" 
          onPress={() => navigation.navigate('Certificates')} 
          colors={colors} 
        />
        <MenuItem 
          icon="settings-outline" 
          title="Sozlamalar" 
          onPress={() => navigation.navigate('Settings')} 
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
      <Text style={[styles.menuItemTitle, { color: isDanger ? colors.error : colors.text }]}>{title}</Text>
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
    borderColor: '#fff',
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
    backgroundColor: '#ccc',
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
