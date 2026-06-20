// Gradient tokenlari — LinearGradient `colors` propiga to'g'ridan-to'g'ri beriladi.
// Har biri kamida 2 to'xtash nuqtasi (LinearGradient talabi).
// useTheme().gradients orqali joriy mode bo'yicha olinadi.
type Stops = readonly [string, string, ...string[]];

interface GradientSet {
  brand: Stops;       // asosiy CTA / hero kartalar (indigo → violet)
  brandVivid: Stops;  // yanada yorqin urg'u (indigo → magenta)
  accent: Stops;      // XP / streak / mukofot (amber → orange)
  success: Stops;     // bajarildi / yutuq
  info: Stops;        // cyan → ko'k
  surface: Stops;     // nozik card foni (deyarli tekis)
}

export const gradients: Record<'dark' | 'light' | 'amoled', GradientSet> = {
  dark: {
    brand: ['#6366F1', '#8B5CF6'],
    brandVivid: ['#6366F1', '#A855F7'],
    accent: ['#F59E0B', '#FB923C'],
    success: ['#10B981', '#34D399'],
    info: ['#06B6D4', '#3B82F6'],
    surface: ['#161A2E', '#1C2138'],
  },
  light: {
    brand: ['#6366F1', '#8B5CF6'],
    brandVivid: ['#6366F1', '#A855F7'],
    accent: ['#F59E0B', '#FB923C'],
    success: ['#10B981', '#34D399'],
    info: ['#06B6D4', '#3B82F6'],
    surface: ['#FFFFFF', '#F6F7FB'],
  },
  amoled: {
    brand: ['#6366F1', '#8B5CF6'],
    brandVivid: ['#6366F1', '#A855F7'],
    accent: ['#F59E0B', '#FB923C'],
    success: ['#10B981', '#34D399'],
    info: ['#06B6D4', '#3B82F6'],
    surface: ['#0A0C16', '#12152480'],
  },
};
