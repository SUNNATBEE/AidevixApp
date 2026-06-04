import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type StreakVariant = 'increased' | 'freezeUsed' | 'restarted';

interface StreakCelebrationModalProps {
  visible: boolean;
  streak: number;
  variant: StreakVariant;
  onClose: () => void;
}

const TEXT: Record<StreakVariant, { title: string; subtitle: string }> = {
  increased: {
    title: 'Olov yonyapti! 🔥',
    subtitle: 'Bugun ham kirding — streak davom etmoqda!',
  },
  freezeUsed: {
    title: 'Streak saqlandi 🧊',
    subtitle: 'Streak freeze ishlatildi, olovingiz o\'chmadi.',
  },
  restarted: {
    title: 'Yangi streak boshlandi 🔥',
    subtitle: 'Bugundan davom et — har kuni kirib olovni ushlab tur!',
  },
};

const StreakCelebrationModal = ({ visible, streak, variant, onClose }: StreakCelebrationModalProps) => {
  const { colors, spacing, typography } = useTheme();
  const { title, subtitle } = TEXT[variant];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, padding: spacing.xl }]}>
          <Ionicons name="flame" size={88} color={colors.accent} />
          <Text style={[styles.streak, { color: colors.text, fontSize: typography.sizes.xxxl }]}>
            {streak}
          </Text>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.lg }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
            {subtitle}
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.button, { backgroundColor: colors.primary, marginTop: spacing.lg }]}
          >
            <Text style={[styles.buttonText, { color: '#fff', fontSize: typography.sizes.md }]}>
              Davom etish
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    alignItems: 'center',
  },
  streak: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  title: {
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    fontWeight: '700',
  },
});

export default StreakCelebrationModal;
