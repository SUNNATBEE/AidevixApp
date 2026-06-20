# UI Redizayn 2026 — Dizayn & Tatbiq Patterni

> Maqsad: butun ilovani jonli **indigo/violet** palitra, nozik & silliq animatsiya va
> izchil layoutga o'tkazish. Bu hujjat ekran agentlari uchun **yagona haqiqat manbai**.

## 1. Rang tizimi (TAYYOR — o'zgartirmang)
`src/theme/colors.ts` yangilangan. `useTheme()` quyidagilarni beradi:
- `colors`: `primary, primarySoft, secondary, secondarySoft, accent, accentSoft, background, card, cardElevated, muted, text, textSecondary, border, error, success, shadow`
- `gradients`: `brand, brandVivid, accent, success, info, surface` (LinearGradient `colors` propi uchun tuple)
- `radii`: `sm(8) md(12) lg(16) xl(20) pill(999)`
- `spacing`: `xs(4) sm(8) md(12) lg(16) xl(20) xxl(24) xxxl(32) huge(48)`
- `typography`: `sizes.{xs..xxxl}`, `weights`, `lineHeights`
- `shadow(level, color)` import: `import { shadow } from '../../theme'` → `shadow('sm'|'md'|'lg'|'glow', colors.shadow)`

## 2. Qayta ishlatiladigan primitivlar (TAYYOR — shularni ishlating, qayta yozmang)
`src/components/common/` ichida:
| Komponent | Vazifa |
|-----------|--------|
| `Screen` | Har ekran tashqi qobig'i: SafeArea + fon + scroll/refresh. `scroll`, `refreshing`, `onRefresh`, `padded`, `edges` proplari. |
| `FadeInView` | `delay` bilan ketma-ket fade+slide. Bo'limlarni jonlantirish uchun. |
| `AnimatedPressable` | Bosishda scale+spring. `onPress`, `scaleDown`. |
| `Card` | Yuza: fon+chegara+radius+soft soya. `onPress` (animatsiyali), `elevated`, `noPadding`. |
| `GradientCard` | Gradient hero/CTA karta. `variant` (brand/brandVivid/accent/success/info), `onPress`, `glow`. |
| `SectionHeader` | Sarlavha + "Hammasi" havolasi. `title`, `actionLabel`, `onActionPress`. |
| `StatCard` | Ikon + qiymat + label statistika kartasi. |
| `ListItem` | Menyu/sozlama qatori: ikon+sarlavha+tavsif+chevron/right. |
| `IconBadge` | Yumaloq tintlangan ikon. `name`, `color`, `size`, `filled`. |
| `ProgressBar` | Animatsiyali progress (mavjud). |
| `Button`, `Input`, `Loader`, `SkeletonLoader`, `XPToast` | Mavjud — ishlating. |

## 3. Tatbiq patterni (HAR EKRAN UCHUN)
1. **Tashqi qobiq:** `ScrollView`/`SafeAreaView`/xom `View` o'rniga `<Screen scroll refreshing={r} onRefresh={fn}>`.
   - `marginTop: 40` kabi qattiq qiymatlarni olib tashlang — SafeArea hal qiladi.
2. **Tokenlar:** xom rang (`'#fff'`, `color + '15'`), radius (`16`, `20`), inline soya o'rniga `colors.*`, `radii.*`, `spacing.*`, `IconBadge`, `shadow()`.
3. **Stagger animatsiya:** asosiy bo'limlarni `<FadeInView delay={n}>` ga o'rang, `delay` ni 60ms qadam bilan oshiring (0, 60, 120, 180...).
4. **Bosish:** har bosiladigan karta/qator `Card onPress` / `ListItem` / `AnimatedPressable` orqali (scale + haptic).
5. **Ro'yxatlar:** `FlatList` elementlariga Reanimated `entering={FadeInDown.delay(i*50).springify()}` (Animated.View bilan) yoki element `FadeInView`.
6. **Hero/CTA bloklar:** tekis rang o'rniga `GradientCard variant="brand"`.
7. **Progress:** xom progress bar o'rniga `<ProgressBar progress={n} />`.
8. **Haptics:** muhim harakatlarda `src/utils/haptics` (mavjud bo'lsa) ishlating.

## 4. Cheklovlar (QAT'IY)
- `src/theme/**`, `src/components/common/**`, `src/navigation/**` ni **O'ZGARTIRMANG** — ular tayyor, faqat import qiling.
- Faqat sizga biriktirilgan fayllarni tahrirlang.
- Biznes mantiq, API chaqiruvlar, redux, props nomlari, navigatsiya marshrutlarini **buzmang** — faqat UI/uslub/animatsiya.
- Funksionallik bir xil qolishi shart. TypeScript toza bo'lsin (`npx tsc --noEmit` o'z fayllaringizda xatosiz).
- Matnlar o'zbekcha qoladi.

## 5. Animatsiya darajasi: "nozik & silliq"
- Ekran: 60ms stagger fade+slide.
- Bosish: 0.96–0.98 scale + spring + haptic.
- Progress/streak: smooth `withTiming`.
- Tab: ikon bounce (TAYYOR).
- Lottie/konfetti SHART EMAS (minimal, batareyaga yengil).

## 6. Ekran klasterlari (agentlarga taqsimot)
- **A — Home/Gamifikatsiya:** `screens/home/HomeScreen`, `components/home/ActivityFeed`, `components/gamification/StreakCounter`, `components/gamification/StreakCelebrationModal`, `screens/challenge/DailyChallengeScreen`
- **B — Kurslar:** `screens/courses/CoursesScreen`, `CourseDetailScreen`, `VideoPlayerScreen`, `components/course/CourseCard`, `screens/profile/MyCoursesScreen`
- **C — Profil:** `screens/profile/ProfileScreen`, `EditProfileScreen`, `SettingsScreen`, `FollowScreen`, `ReferralsScreen`, `CertificatesScreen`
- **D — Auth:** `screens/auth/LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen`, `VerifyEmailScreen`, `components/auth/GoogleSignInButton`
- **E — Engagement:** `screens/leaderboard/LeaderboardScreen`, `screens/ai/AIChatScreen`, `screens/shorts/ShortsScreen`, `screens/founders/FoundersScreen`, `screens/subscription/SubscriptionScreen`, `screens/playground/CodePlaygroundScreen`, `screens/playground/AiHelperModal`
