import { Platform, ViewStyle } from 'react-native';

// Izchil soft soyalar. shadowColor'ni chaqiruvchi (odatda theme.colors.shadow) beradi —
// light'da indigo glow, dark'da qora. Android `elevation` bilan moslashtirilgan.
type Level = 'sm' | 'md' | 'lg' | 'glow';

const ios: Record<Level, ViewStyle> = {
  sm: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  md: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 14 },
  lg: { shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24 },
  glow: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 18 },
};

const androidElevation: Record<Level, number> = { sm: 2, md: 6, lg: 12, glow: 10 };

/**
 * shadow('md', colors.shadow) → platforma-mos soya style obyekti.
 * GradientCard'da shadow('glow', colors.primary) bilan rangli porlash beriladi.
 */
export const shadow = (level: Level = 'md', color: string = '#000'): ViewStyle =>
  Platform.select({
    ios: { shadowColor: color, ...ios[level] },
    default: { elevation: androidElevation[level], shadowColor: color },
  })!;
