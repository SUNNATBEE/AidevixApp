import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
    Alert,
    FlatList,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AnimatedPressable from '../../components/common/AnimatedPressable';
import CardSkeleton from '../../components/common/CardSkeleton';
import FadeInView from '../../components/common/FadeInView';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Certificate, fetchMyCertificates } from '../../store/slices/certificateSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

const CertificatesScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.certificate);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = useCallback(async (opts?: { refresh?: boolean }) => {
    if (opts?.refresh) setRefreshing(true);
    await dispatch(fetchMyCertificates());
    setRefreshing(false);
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDownload = async (cert: Certificate) => {
    triggerHaptic('light');
    if (cert.downloadUrl) {
      await Linking.openURL(cert.downloadUrl);
    } else {
      Alert.alert('Yuklab olish', `Sertifikat kodi: ${cert.code}`);
    }
  };

  const renderItem = ({ item, index }: { item: Certificate; index: number }) => (
    <FadeInView delay={index * 80}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.iconBox, { backgroundColor: colors.primarySoft, borderRadius: radii.lg }]}>
            <Ionicons name="ribbon" size={28} color={colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text
              style={[styles.courseTitle, { color: colors.text, fontSize: typography.sizes.md }]}
              numberOfLines={2}
            >
              {item.courseTitle || 'Kurs sertifikati'}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>
              {item.issuedAt
                ? new Date(item.issuedAt).toLocaleDateString('uz-UZ')
                : ''}
            </Text>
            <Text style={[styles.code, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>
              Kod: {item.code}
            </Text>
          </View>
        </View>

        <AnimatedPressable
          style={[
            styles.downloadBtn,
            { backgroundColor: colors.primary, borderRadius: radii.md, marginTop: spacing.md },
          ]}
          onPress={() => handleDownload(item)}
        >
          <Ionicons name="download-outline" size={16} color="#ffffff" />
          <Text style={styles.downloadText}>Yuklab olish</Text>
        </AnimatedPressable>
      </View>
    </FadeInView>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ padding: spacing.xl }}>
          <CardSkeleton variant="certificate" count={3} />
        </View>
      );
    }
    return (
      <View style={[styles.empty, { padding: spacing.xxl }]}>
        <Ionicons name="ribbon-outline" size={56} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text, marginTop: spacing.md }]}>
          {error || 'Hali sertifikat yo\'q'}
        </Text>
        <Text style={[styles.emptySub, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Kursni tugatgach sertifikat olasiz
        </Text>
      </View>
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
          Sertifikatlarim
        </Text>
      </View>

      <FlatList
        data={items}
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
  card: { borderRadius: 16, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  courseTitle: { fontWeight: '700', lineHeight: 20 },
  date: { marginTop: 4 },
  code: { marginTop: 2 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
  },
  downloadText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  emptySub: { fontSize: 13, textAlign: 'center' },
});

export default CertificatesScreen;
