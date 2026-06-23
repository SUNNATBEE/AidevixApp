import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FadeInView from '../../components/common/FadeInView';
import GradientCard from '../../components/common/GradientCard';
import ListItem from '../../components/common/ListItem';
import Screen from '../../components/common/Screen';
import StatCard from '../../components/common/StatCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

const ProfileScreen = ({ navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const goEdit = () => {
    triggerHaptic('light');
    navigation.navigate('EditProfile');
  };

  const nav = (screen: string, params?: any) => () => {
    triggerHaptic('light');
    navigation.navigate(screen, params);
  };

  const handleLogout = () => {
    triggerHaptic('warning');
    dispatch(logout());
  };

  return (
    <Screen scroll padded>
      {/* Gradient profil header */}
      <FadeInView delay={0}>
        <GradientCard variant="brand" glow style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
          <View style={[styles.avatarContainer, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>{user?.firstName?.[0] || 'U'}</Text>
            )}
            <TouchableOpacity
              style={[styles.editBadge, { backgroundColor: '#fff' }]}
              onPress={goEdit}
              hitSlop={8}
            >
              <Ionicons name="camera" size={15} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={[styles.rankBadge, { borderRadius: radii.pill }]}>
            <Ionicons name="shield-checkmark" size={13} color="#fff" />
            <Text style={styles.rankText}>{user?.rankTitle || 'AMATEUR'}</Text>
          </View>
        </GradientCard>
      </FadeInView>

      {/* Statistika */}
      <FadeInView delay={60}>
        <View style={[styles.statsRow, { marginTop: spacing.lg }]}>
          <StatCard icon="flash" value={(user?.xp || 0).toLocaleString()} label="XP ball" color={colors.accent} />
          <StatCard icon="flame" value={user?.streak || 0} label="Kunlik streak" color={colors.error} />
        </View>
      </FadeInView>

      {/* Menyu */}
      <FadeInView delay={120}>
        <View style={[styles.menu, { marginTop: spacing.lg, gap: spacing.sm }]}>
          <ListItem icon="person-circle-outline" title="Profilni tahrirlash" onPress={goEdit} />
          <ListItem icon="book" iconColor={colors.secondary} title="Mening kurslarim" onPress={nav('MyCourses')} />
          <ListItem icon="ribbon-outline" iconColor={colors.accent} title="Sertifikatlarim" onPress={nav('Certificates')} />
          <ListItem icon="people-outline" title="Followerlar" onPress={nav('Follow', { tab: 'followers' })} />
          <ListItem icon="gift-outline" iconColor={colors.success} title="Do'st taklif qilish" onPress={nav('Referrals')} />
          <ListItem icon="bar-chart-outline" iconColor={colors.primary} title="Analitika" onPress={nav('Analytics')} />
          <ListItem icon="settings-outline" title="Sozlamalar" onPress={nav('Settings')} />
          <ListItem icon="log-out-outline" title="Chiqish" onPress={handleLogout} danger chevron={false} />
        </View>
      </FadeInView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontSize: 22, fontWeight: '800', color: '#fff' },
  email: { fontSize: 14, marginTop: 2, color: 'rgba(255,255,255,0.85)' },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },
  rankText: { fontSize: 12, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12 },
  menu: {},
});

export default ProfileScreen;
