# CLAUDE.md

Bu fayl Claude Code uchun Aidevix loyihasining to'liq texnik konteksti. Har bir sessiyada avtomatik yuklanadi — Claude shu qoidalarni bilgan holda ishlaydi.

---

## 1. Loyiha Haqida

**Aidevix** — O'zbek tilidagi AI-yordamchili dasturlash o'quv platformasi. Mobil ilova React Native + Expo da qurilgan, backend Railway'da hostlangan.

- **Entry point**: `index.js` → `App.tsx` → `src/navigation/RootNavigator.tsx`
- **Backend**: `EXPO_PUBLIC_API_URL` (default: `https://aidevix-backend-production.up.railway.app/api`)
- **Til**: UI stringlar **O'zbek tilida** (boshqa tillarga tarjima qilinmaydi)
- **Platformalar**: iOS, Android (Expo Go + EAS Build). Web minimal qo'llab-quvvatlanadi.

---

## 2. Arxitektura (MUHIM)

Loyihada **ikkita papka ko'rinadi**, lekin faqat bittasi aktiv:

| Papka | Maqsad | Holat |
|-------|--------|-------|
| **`src/`** | Haqiqiy production ilovasi (Redux + React Navigation v7) | ✅ **Ishlatilmoqda** |
| `app/`, `components/`, `hooks/`, `constants/` | Expo Router shabloni (default expo create paytida yaratilgan) | ❌ **Ishlatilmayapti** — tegmang |

**Qoida**: Barcha yangi kod `src/` ichida yoziladi. `app/` papkasidagi fayllarni (`_layout.tsx`, `(tabs)`, `modal.tsx`) **tahrirlamang** — ular eski boilerplate. Agar o'chirish so'ralmasa, ularga tegmay qoldiring.

### `src/` tuzilishi

```
src/
├── api/              # Axios qatlam: authApi, courseApi, promptApi, rankingApi, xpApi
│   └── axiosInstance.ts  # JWT interceptor + refresh token logic
├── components/
│   ├── common/       # Button, Input, Loader, SkeletonLoader (reusable UI)
│   ├── course/       # CourseCard
│   ├── gamification/ # StreakCounter kabi reward UI
│   └── home/         # ActivityFeed
├── navigation/       # React Navigation v7 — RootNavigator, MainTabs, HomeStack, AuthStack, types.ts
├── screens/
│   ├── ai/           # AIChatScreen
│   ├── auth/         # Login, Register, ForgotPassword, ResetPassword
│   ├── courses/      # CoursesScreen, VideoPlayerScreen
│   ├── focus/        # FocusModeScreen (Pomodoro)
│   ├── home/         # HomeScreen
│   ├── leaderboard/  # LeaderboardScreen
│   ├── playground/   # CodePlaygroundScreen (HTML/CSS/JS webview)
│   ├── profile/      # ProfileScreen
│   ├── prompts/      # PromptsScreen
│   ├── shorts/       # ShortsScreen
│   └── subscription/ # Premium obuna
├── store/
│   ├── index.ts      # configureStore
│   ├── hooks.ts      # useAppDispatch, useAppSelector (typed)
│   └── slices/       # authSlice, courseSlice, chatSlice, promptSlice, rankingSlice, offlineSlice
├── theme/            # colors (dark/light/amoled), spacing, typography, ThemeProvider
├── types/            # User, UserStats, Course, Video, Section
└── utils/            # constants, storage, haptics, notifications, download
```

---

## 3. Texnologiya Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19.1
- **Navigation**: `@react-navigation/native` v7 (NOT Expo Router)
- **State**: `@reduxjs/toolkit` + `react-redux` 9 + `createAsyncThunk`
- **Storage**: `@react-native-async-storage/async-storage`
- **HTTP**: `axios` + JWT Bearer interceptor (`axiosInstance.ts`)
- **Formlar**: `react-hook-form`
- **Animatsiya**: `lottie-react-native`, `react-native-reanimated` v4
- **Media**: `expo-av` (video), `expo-file-system` (offline download), Bunny CDN
- **Haptics**: `expo-haptics` → `triggerHaptic()` helper
- **Notifications**: `expo-notifications`
- **TypeScript**: strict mode, path alias `@/*` → `./*`

---

## 4. Kod Yozish Konventsiyalari

### Theme (MAJBURIY)
Hech qachon rangni qattiq kodlamang. `useTheme()` hookidan foydalaning:
```tsx
const { colors, spacing, typography } = useTheme();
// <View style={{ backgroundColor: colors.background }} />
```
`colors.primary`, `colors.card`, `colors.text`, `colors.textSecondary`, `colors.border`, `colors.error`, `colors.success` mavjud. `spacing.xs..huge` va `typography.sizes.xs..xxxl` ishlating.

### Haptic Feedback
Har qanday user action (tugma, swipe, success/error) uchun:
```tsx
import { triggerHaptic } from '@/src/utils/haptics';
triggerHaptic('light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error');
```

### API Chaqiruvlar
Hech qachon `axios` to'g'ridan-to'g'ri import qilmang — `axiosInstance` orqali token va refresh logikasi avtomatik ishlaydi:
```ts
import axiosInstance from '@/src/api/axiosInstance';
axiosInstance.get('/courses');  // token automatik qo'shiladi
```
Yangi endpoint qo'shganda `src/api/*Api.ts` ichiga qo'ying (thin wrapper).

### Redux Pattern
- Har bir domen uchun alohida slice (`authSlice`, `courseSlice`, ...)
- Server chaqiruvlar `createAsyncThunk` orqali
- Komponentlarda `useAppDispatch()` + `useAppSelector()` (typed versiyalar)
- `serializableCheck: false` — Date va class instancelarga ruxsat bor

### Navigation
- Typed paramlar `src/navigation/types.ts` da
- `headerShown: false` default
- Root shart: `isLoggedIn` → `MainTabs`, aks holda → `AuthStack`

### Komponent Naming
- Fayllar va komponentlar: `PascalCase.tsx` (`Button.tsx`, `HomeScreen.tsx`)
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Default export har bir komponent/screen uchun

### UI Matn
- **Faqat O'zbek tilida**. Inglizcha placeholder qoldirmang. Apostrof uchun `\'` ishlating: `'O\'quvchi'`

---

## 5. Environment Variables

Barchasi `EXPO_PUBLIC_` prefiksi bilan (Expo public envs runtime'da mavjud):

| Variable | Maqsad |
|----------|--------|
| `EXPO_PUBLIC_API_URL` | Backend API ildizi (`/api` bilan tugashi kerak) |
| `EXPO_PUBLIC_TELEGRAM_CHANNEL` | Telegram kanal linki |
| `EXPO_PUBLIC_TELEGRAM_BOT` | Telegram bot linki |
| `EXPO_PUBLIC_INSTAGRAM_URL` | Instagram profili |
| `EXPO_PUBLIC_PROJECT_ID` | EAS projectId |

`.env` ni **commit qilmang**. Namuna — `.env.example`.

---

## 6. Skriptlar

```bash
npm install                # dependenciylar
npx expo start --offline   # login so'ramasdan Metro'ni ochish (tavsiya etiladi)
npm run android            # Android emulator
npm run ios                # iOS simulator
npm run web                # web preview
npm run lint               # expo lint (ESLint flat config)
npm run reset-project      # scripts/reset-project.js — eski template tozalovchi
```

Build: `eas build --profile preview|production` (EAS CLI >= 12).

---

## 7. Nimalarni Qilish Mumkin EMAS

- ❌ **Inline ranglar** (`#ffffff`, `rgb(...)`) — faqat `useTheme()`
- ❌ `/app`, `/components` (root), `/hooks` (root), `/constants` (root) papkalarini o'zgartirish — bular eski boilerplate
- ❌ `axios` to'g'ridan-to'g'ri import — faqat `axiosInstance`
- ❌ English UI stringlar — barcha foydalanuvchiga ko'rinadigan matn o'zbekcha
- ❌ `any` tipni keng ishlatish — API javoblarini `types/` ichida typelang
- ❌ `.env` faylini commit qilish
- ❌ `expo-router` qo'shish (loyiha React Navigation'da)

---

## 8. Model Tanlash Qo'llanmasi (Token Tejash)

`MODEL_GUIDE.md` ga qarang. Qisqacha:

| Prompt turi | Tavsiya etilgan model | Buyruq |
|-------------|----------------------|--------|
| Oddiy savol, nomlash, bitta satr o'zgartirish | **Haiku 4.5** | `/model haiku` |
| Komponent yozish, bug tuzatish, refactor | **Sonnet 4.6** | `/model sonnet` |
| Arxitektura, ko'p fayl, murakkab debug | **Opus 4.7** | `/model opus` |
| Tezroq natija kerak (Opus'da) | Opus 4.6 fast | `/fast` |

Har sessiya boshida prompt murakkabligini baholang va mos modelni tanlang.

---

## 9. Muhim Fayllar

- `App.tsx` — ildiz komponent (Provider + ThemeProvider + RootNavigator)
- `src/api/axiosInstance.ts` — JWT refresh logikasi
- `src/navigation/RootNavigator.tsx` — auth gating
- `src/store/index.ts` — Redux store konfiguratsiyasi
- `src/theme/ThemeProvider.tsx` — dark/light/amoled tema tizimi
- `src/utils/constants.ts` — CATEGORIES, RANKS, API_URL

---

**Eslatma**: Agar nimadir bu faylga zid ko'rinsa — kod to'g'ri, fayl eskirgan. Darhol foydalanuvchiga ayting.
