import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';
import SkeletonLoader from './SkeletonLoader';

interface CardSkeletonProps {
  variant?: 'course' | 'list' | 'profile' | 'certificate';
  count?: number;
}

const CourseSkeleton = ({ colors, spacing }: any) => (
  <View style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <SkeletonLoader height={120} borderRadius={12} />
    <View style={{ padding: 12, gap: 8 }}>
      <SkeletonLoader height={14} width="80%" borderRadius={6} />
      <SkeletonLoader height={12} width="50%" borderRadius={6} />
      <View style={styles.row}>
        <SkeletonLoader height={12} width="30%" borderRadius={6} />
        <SkeletonLoader height={12} width="25%" borderRadius={6} />
      </View>
    </View>
  </View>
);

const ListSkeleton = ({ colors }: any) => (
  <View style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <SkeletonLoader width={48} height={48} borderRadius={24} />
    <View style={{ flex: 1, gap: 8 }}>
      <SkeletonLoader height={14} width="70%" borderRadius={6} />
      <SkeletonLoader height={12} width="45%" borderRadius={6} />
    </View>
    <SkeletonLoader width={60} height={28} borderRadius={14} />
  </View>
);

const ProfileSkeleton = ({ colors }: any) => (
  <View style={styles.profileWrap}>
    <SkeletonLoader width={100} height={100} borderRadius={50} style={{ alignSelf: 'center' }} />
    <View style={{ gap: 10, marginTop: 16, alignItems: 'center' }}>
      <SkeletonLoader height={18} width={160} borderRadius={8} />
      <SkeletonLoader height={13} width={120} borderRadius={6} />
      <SkeletonLoader height={24} width={80} borderRadius={12} />
    </View>
    <View style={[styles.statsRow, { marginTop: 20 }]}>
      <SkeletonLoader height={40} width={80} borderRadius={10} />
      <SkeletonLoader height={40} width={80} borderRadius={10} />
    </View>
  </View>
);

const CertificateSkeleton = ({ colors }: any) => (
  <View style={[styles.certCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <View style={styles.row}>
      <SkeletonLoader width={52} height={52} borderRadius={14} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonLoader height={14} width="75%" borderRadius={6} />
        <SkeletonLoader height={12} width="40%" borderRadius={6} />
        <SkeletonLoader height={11} width="55%" borderRadius={6} />
      </View>
    </View>
    <SkeletonLoader height={38} borderRadius={10} style={{ marginTop: 12 }} />
  </View>
);

const CardSkeleton = ({ variant = 'course', count = 3 }: CardSkeletonProps) => {
  const { colors, spacing } = useTheme();

  const renderItem = (i: number) => {
    switch (variant) {
      case 'list':
        return <ListSkeleton key={i} colors={colors} />;
      case 'profile':
        return <ProfileSkeleton key={i} colors={colors} />;
      case 'certificate':
        return <CertificateSkeleton key={i} colors={colors} />;
      default:
        return <CourseSkeleton key={i} colors={colors} spacing={spacing} />;
    }
  };

  return <>{Array.from({ length: count }).map((_, i) => renderItem(i))}</>;
};

const styles = StyleSheet.create({
  courseCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  certCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  profileWrap: {
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
});

export default CardSkeleton;
