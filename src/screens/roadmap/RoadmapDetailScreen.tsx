import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import ProgressBar from '../../components/common/ProgressBar';
import { triggerHaptic } from '../../utils/haptics';
import { useRoadmapProgress } from '../../hooks/useRoadmapProgress';
import { getRoadmapById, roadmapProgress, stepPercent } from '../../data/roadmaps';

const RoadmapDetailScreen = ({ route, navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const { roadmapId } = route.params;
  const roadmap = getRoadmapById(roadmapId);
  const { statsByCat, loading } = useRoadmapProgress();

  if (!roadmap) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>Roadmap topilmadi</Text>
      </SafeAreaView>
    );
  }

  const accent = colors[roadmap.color];
  const overall = roadmapProgress(roadmap, statsByCat);

  const openCategory = (category: string) => {
    triggerHaptic('light');
    navigation.navigate('CoursesStack', { screen: 'Courses', params: { category } });
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.topBar, { paddingHorizontal: spacing.lg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: accent + '18', borderRadius: radii.xl }]}>
          <View style={[styles.heroIcon, { backgroundColor: accent }]}>
            <Ionicons name={roadmap.icon} size={28} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{roadmap.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{roadmap.subtitle}</Text>

          <View style={styles.progressRow}>
            <ProgressBar progress={overall.percent} color={accent} trackColor={colors.border} style={{ flex: 1 }} />
            <Text style={[styles.percent, { color: accent }]}>{overall.percent}%</Text>
          </View>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {overall.doneSteps}/{overall.totalSteps} bosqich tugatildi
          </Text>
        </View>

        {loading && (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator color={accent} />
          </View>
        )}

        {/* Stepper */}
        <View style={{ marginTop: spacing.xl }}>
          {roadmap.steps.map((step, i) => {
            const pct = stepPercent(statsByCat, step.category);
            const stat = statsByCat[step.category];
            const done = pct >= 100;
            const isLast = i === roadmap.steps.length - 1;
            return (
              <View key={step.category + i} style={styles.stepRow}>
                {/* Indikator ustun (raqam + chiziq) */}
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: done ? accent : colors.card,
                        borderColor: pct > 0 ? accent : colors.border,
                      },
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <Text style={[styles.stepNum, { color: pct > 0 ? accent : colors.textSecondary }]}>{i + 1}</Text>
                    )}
                  </View>
                  {!isLast && <View style={[styles.connector, { backgroundColor: colors.border }]} />}
                </View>

                {/* Kontent karta */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => openCategory(step.category)}
                  style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}
                >
                  <View style={styles.stepHeader}>
                    <Text style={[styles.stepLabel, { color: colors.text }]}>{step.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </View>
                  <View style={styles.progressRow}>
                    <ProgressBar progress={pct} color={accent} trackColor={colors.border} style={{ flex: 1 }} />
                    <Text style={[styles.stepPct, { color: colors.textSecondary }]}>{pct}%</Text>
                  </View>
                  <Text style={[styles.stepMeta, { color: colors.textSecondary }]}>
                    {stat ? `${stat.completed}/${stat.total} kurs tugatildi` : 'Kurs hali yo\'q'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { height: 48, justifyContent: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  hero: { padding: 20, alignItems: 'center', gap: 6 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', marginTop: 10 },
  percent: { fontSize: 14, fontWeight: '800', minWidth: 40, textAlign: 'right' },
  meta: { fontSize: 12, marginTop: 6 },

  stepRow: { flexDirection: 'row', gap: 12 },
  indicatorCol: { alignItems: 'center', width: 32 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 14, fontWeight: '700' },
  connector: { width: 2, flex: 1, marginVertical: 4 },

  stepCard: { flex: 1, padding: 14, borderWidth: 1, marginBottom: 14, gap: 6 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { fontSize: 16, fontWeight: '700' },
  stepPct: { fontSize: 12, fontWeight: '600', minWidth: 36, textAlign: 'right' },
  stepMeta: { fontSize: 12 },
});

export default RoadmapDetailScreen;
