import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import ProgressBar from '../common/ProgressBar';
import SectionHeader from '../common/SectionHeader';
import { triggerHaptic } from '../../utils/haptics';
import { ROADMAPS, roadmapProgress } from '../../data/roadmaps';
import { useRoadmapProgress } from '../../hooks/useRoadmapProgress';

const RoadmapsSection = ({ navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const { statsByCat } = useRoadmapProgress();

  const open = (roadmapId: string) => {
    triggerHaptic('light');
    navigation.navigate('RoadmapDetail', { roadmapId });
  };

  return (
    <View style={[styles.section, { paddingHorizontal: spacing.xl }]}>
      <SectionHeader title="O'quv yo'llari" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.md, paddingVertical: 4 }}
      >
        {ROADMAPS.map((r) => {
          const accent = colors[r.color];
          const { percent, doneSteps, totalSteps } = roadmapProgress(r, statsByCat);
          return (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.8}
              onPress={() => open(r.id)}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}
            >
              <View style={[styles.iconBox, { backgroundColor: accent + '22' }]}>
                <Ionicons name={r.icon} size={22} color={accent} />
              </View>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{r.title}</Text>
              <Text style={[styles.steps, { color: colors.textSecondary }]}>{totalSteps} bosqich</Text>
              <View style={styles.progressRow}>
                <ProgressBar progress={percent} color={accent} trackColor={colors.border} style={{ flex: 1 }} />
                <Text style={[styles.percent, { color: accent }]}>{percent}%</Text>
              </View>
              <Text style={[styles.done, { color: colors.textSecondary }]}>{doneSteps}/{totalSteps} tugatildi</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  card: { width: 200, padding: 14, borderWidth: 1, gap: 6 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '700' },
  steps: { fontSize: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  percent: { fontSize: 12, fontWeight: '800', minWidth: 34, textAlign: 'right' },
  done: { fontSize: 11, marginTop: 2 },
});

export default RoadmapsSection;
