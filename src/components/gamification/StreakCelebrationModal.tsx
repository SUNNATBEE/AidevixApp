import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
  const { colors, gradients, spacing, typography, radii } = useTheme();
  const { title, subtitle } = TEXT[variant];

  const cardScale = useSharedValue(0.85);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      cardScale.value = 0.85;
      cardScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      pulse.value = withRepeat(
        withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View
          style={[styles.card, { backgroundColor: colors.card, padding: spacing.xl }, cardStyle]}
        >
          <Animated.View style={flameStyle}>
            <Ionicons name="flame" size={88} color={colors.accent} />
          </Animated.View>
          <Text style={[styles.streak, { color: colors.text, fontSize: typography.sizes.xxxl }]}>
            {streak}
          </Text>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.lg }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
            {subtitle}
          </Text>
          <Pressable onPress={onClose} style={[styles.buttonWrap, { marginTop: spacing.lg }]}>
            <LinearGradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, { borderRadius: radii.pill }]}
            >
              <Text style={[styles.buttonText, { color: '#fff', fontSize: typography.sizes.md }]}>
                Davom etish
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
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
  streak: { fontWeight: 'bold', marginTop: 8 },
  title: { fontWeight: '700', marginTop: 8, textAlign: 'center' },
  subtitle: { marginTop: 8, textAlign: 'center', lineHeight: 22 },
  buttonWrap: { alignSelf: 'stretch' },
  button: { paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  buttonText: { fontWeight: '700' },
});

export default StreakCelebrationModal;
