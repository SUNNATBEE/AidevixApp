# Kunlik Streak (Check-in) — Mobil Implementatsiya Rejasi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Foydalanuvchi har kuni ilovaga kirsa (online bo'lsa) 🔥 streak +1 oshadi va tabrik oynasi ko'rsatiladi.

**Architecture:** Ilova old planga chiqqanda (`AppState → active`) yoki ishga tushganda, `useDailyCheckIn` hook AsyncStorage guard orqali kuniga bir marta `POST /xp/check-in` ga so'rov yuboradi. Server yangi streak qiymatini qaytaradi → `authSlice.updateUserLocal` orqali Redux'ga yoziladi → Home/Profil avtomatik yangilanadi. Yangi oshish bo'lsa `StreakCelebrationModal` chiqadi. Streak server vaqti bo'yicha hisoblanadi (aldashning oldini oladi) — backend endpoint ustoz tomonidan Railway'ga deploy qilinadi.

**Tech Stack:** React Native 0.81, Expo SDK 54, Redux Toolkit, axios (`axiosInstance`), `@react-native-async-storage/async-storage`, `AppState` (react-native), `useTheme()`, `triggerHaptic()`.

**Eslatma — testlar:** Loyihada test runner (jest) sozlanmagan va birorta `*.test.ts` fayl yo'q. Repo patterniga mos ravishda avtomatik testlar yozilmaydi; o'rniga sof (pure) yordamchi funksiya ajratiladi va har task qo'lda tekshiriladi (`npx expo start`). Sana mantig'i sof funksiyada bo'lgani uchun kelajakda oson testlanadi.

**Eslatma — backend bog'liqligi:** `POST /api/xp/check-in` hali Railway'da yo'q. Endpoint chiqmaguncha hook 404 oladi → jim o'tadi (sana saqlanmaydi, modal chiqmaydi, ilova buzilmaydi). Bu kutilgan holat. To'liq sinov endpoint deploy bo'lgach mumkin.

---

## Fayl tuzilishi

| Fayl | Holat | Mas'uliyat |
|------|-------|-----------|
| `src/api/xpApi.ts` | Modify | `checkIn()` endpoint wrapper qo'shish |
| `src/utils/checkInGuard.ts` | Create | Sof sana mantig'i: `todayKey()`, `isNewDay()` + AsyncStorage guard o'qish/yozish |
| `src/components/gamification/StreakCelebrationModal.tsx` | Create | Tabrik UI (flame + streak soni + tabrik matni + tugma) |
| `src/hooks/useDailyCheckIn.ts` | Create | AppState listener, guard, check-in chaqiruvi, Redux yangilash, modal holati |
| `src/navigation/RootNavigator.tsx` | Modify | Hook'ni ulash + modalni render qilish (Provider ichida) |

---

## Task 1: `xpApi.checkIn()` endpoint wrapper

**Files:**
- Modify: `src/api/xpApi.ts`

- [ ] **Step 1: Endpoint metodini qo'shish**

`src/api/xpApi.ts` ichidagi `xpApi` obyektiga yangi qator qo'shing (mavjud metodlar uslubiga mos, thin wrapper):

```ts
import axiosInstance from './axiosInstance';

export const xpApi = {
  getStats: () => axiosInstance.get('/xp/stats'),
  markVideoWatched: (videoId: string) => axiosInstance.post(`/xp/video-watched/${videoId}`),
  submitQuiz: (quizId: string, answers: number[]) => axiosInstance.post(`/xp/quiz/${quizId}`, { answers }),
  getQuizForVideo: (videoId: string) => axiosInstance.get(`/xp/quiz/video/${videoId}`),
  updateProfile: (data: any) => axiosInstance.put('/xp/profile', data),
  getHistory: () => axiosInstance.get('/xp/history'),
  getStreakStatus: () => axiosInstance.get('/xp/streak-status'),
  useStreakFreeze: () => axiosInstance.post('/xp/streak-freeze'),
  // Kunlik check-in: server streakni hisoblaydi va yangi qiymatni qaytaradi.
  checkIn: () => axiosInstance.post('/xp/check-in'),
};
```

- [ ] **Step 2: TypeScript tekshiruvi**

Run: `npx tsc --noEmit`
Expected: Xato yo'q (yangi qator tip xatosi keltirmaydi).

- [ ] **Step 3: Commit**

```bash
git add src/api/xpApi.ts
git commit -m "feat(xp): add checkIn endpoint wrapper for daily streak"
```

---

## Task 2: Sof sana guard yordamchisi

**Files:**
- Create: `src/utils/checkInGuard.ts`

Mas'uliyat: "bugun allaqachon urinilganmi?" mantig'ini AppState/hook'dan ajratish. Mahalliy sana (foydalanuvchi soat mintaqasi) bo'yicha kun kalitini hosil qiladi — bu faqat **ortiqcha so'rovni** to'sish uchun. Haqiqiy streak hisobi serverda (server vaqti). AsyncStorage'da `'YYYY-MM-DD'` satr saqlanadi.

- [ ] **Step 1: Faylni yaratish**

```ts
import { storage } from './storage';

// Mahalliy sana bo'yicha 'YYYY-MM-DD' kalit (soat/minut e'tiborsiz).
// Faqat mobil guard uchun — rasmiy streak hisobi serverda bo'ladi.
export const todayKey = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Saqlangan oxirgi check-in kuni bugundan farq qilsa (yoki yo'q bo'lsa) → yangi kun.
export const isNewDay = (lastKey: string | null, today: string = todayKey()): boolean => {
  return lastKey !== today;
};

const LAST_CHECKIN_KEY = 'aidevix_last_checkin';

// storage.getItem JSON.parse qiladi — biz satr saqlaymiz, JSON satr sifatida o'qiladi.
export const getLastCheckInKey = async (): Promise<string | null> => {
  return (await storage.getItem(LAST_CHECKIN_KEY)) as string | null;
};

export const setLastCheckInKey = async (key: string): Promise<void> => {
  await storage.setItem(LAST_CHECKIN_KEY, key);
};
```

- [ ] **Step 2: TypeScript tekshiruvi**

Run: `npx tsc --noEmit`
Expected: Xato yo'q.

- [ ] **Step 3: Mantiqni qo'lda tekshirish (ixtiyoriy, tez)**

Node REPL'da sof funksiyalarni tekshirish mumkin:
Run: `node -e "const f=(l,t)=>l!==t; console.log(f(null,'2026-06-04'), f('2026-06-03','2026-06-04'), f('2026-06-04','2026-06-04'))"`
Expected: `true true false` (yo'q → yangi kun, kechagi → yangi kun, bugungi → emas).

- [ ] **Step 4: Commit**

```bash
git add src/utils/checkInGuard.ts
git commit -m "feat(streak): add pure daily check-in date guard helpers"
```

---

## Task 3: `StreakCelebrationModal` komponenti

**Files:**
- Create: `src/components/gamification/StreakCelebrationModal.tsx`

Mas'uliyat: streak oshganda chiqadigan tabrik oynasi. Lottie JSON asset loyihada yo'q, shuning uchun mavjud `flame` Ionicon (StreakCounter bilan bir xil uslub) + sodda animatsiyasiz katta ko'rinish ishlatiladi (YAGNI — keyin Lottie qo'shsa bo'ladi). 3 ta matn varianti: oddiy oshish, freeze ishlatildi, yangi streak boshlandi.

- [ ] **Step 1: Faylni yaratish**

```tsx
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
```

**Eslatma:** `colors.accent`, `colors.card`, `colors.primary`, `colors.text`, `colors.textSecondary` va `typography.sizes.md/lg/xxxl`, `spacing.lg/xl` mavjudligini `src/theme/` da tasdiqlang. Agar `typography.sizes.xxxl` yo'q bo'lsa, mavjud eng katta o'lcham bilan almashtiring. Backdrop'dagi yarim shaffof qora rang — bu UI rangi emas, overlay (inline `rgba` bu yerda maqbul, chunki tema rangi emas).

- [ ] **Step 2: TypeScript tekshiruvi**

Run: `npx tsc --noEmit`
Expected: Xato yo'q.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/StreakCelebrationModal.tsx
git commit -m "feat(streak): add StreakCelebrationModal celebration UI"
```

---

## Task 4: `useDailyCheckIn` hook

**Files:**
- Create: `src/hooks/useDailyCheckIn.ts`

Mas'uliyat: AppState `active` bo'lganda (va ilk mount'da) guard'ni tekshirib, kuniga bir marta `xpApi.checkIn()` chaqiradi; javobni Redux'ga yozadi va modal holatini qaytaradi. Faqat `isLoggedIn` bo'lganda ishlaydi. Xato/offline → jim o'tadi, sana saqlanmaydi.

Server javob shakli (dizayndan): `{ success, data: { streak, increased, freezeUsed, alreadyCheckedToday } }`.

- [ ] **Step 1: Faylni yaratish**

```ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserLocal } from '../store/slices/authSlice';
import { xpApi } from '../api/xpApi';
import { triggerHaptic } from '../utils/haptics';
import {
  todayKey,
  isNewDay,
  getLastCheckInKey,
  setLastCheckInKey,
} from '../utils/checkInGuard';
import type { StreakVariant } from '../components/gamification/StreakCelebrationModal';

interface CelebrationState {
  visible: boolean;
  streak: number;
  variant: StreakVariant;
}

const HIDDEN: CelebrationState = { visible: false, streak: 0, variant: 'increased' };

export const useDailyCheckIn = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [celebration, setCelebration] = useState<CelebrationState>(HIDDEN);
  // Bir kun ichida bir nechta AppState eventi kelishi mumkin — qo'shaloq so'rovni to'samiz.
  const inFlight = useRef(false);

  const runCheckIn = useCallback(async () => {
    if (!isLoggedIn || inFlight.current) return;

    const today = todayKey();
    const lastKey = await getLastCheckInKey();
    if (!isNewDay(lastKey, today)) return; // bugun allaqachon urinilgan

    inFlight.current = true;
    try {
      const res = await xpApi.checkIn();
      const data = res.data?.data ?? res.data;
      const streak: number = data?.streak ?? 0;
      const increased: boolean = !!data?.increased;
      const freezeUsed: boolean = !!data?.freezeUsed;

      // Server bilan muvaffaqiyatli aloqa bo'ldi — bugungi kunni belgilaymiz.
      await setLastCheckInKey(today);

      // Streak sonini darhol UI'ga yozamiz (Home/Profil avtomatik yangilanadi).
      dispatch(updateUserLocal({ streak }));

      if (increased || freezeUsed) {
        const variant: StreakVariant = freezeUsed
          ? 'freezeUsed'
          : streak <= 1
          ? 'restarted'
          : 'increased';
        triggerHaptic('success');
        setCelebration({ visible: true, streak, variant });
      }
    } catch {
      // Offline yoki endpoint hali yo'q (404) — jim o'tamiz, sana saqlanmaydi,
      // keyingi ochilishda qayta urinadi.
    } finally {
      inFlight.current = false;
    }
  }, [isLoggedIn, dispatch]);

  // Ilk mount + login holatida bir marta ishga tushiramiz.
  useEffect(() => {
    runCheckIn();
  }, [runCheckIn]);

  // Ilova old planga qaytganda qayta tekshiramiz (uzoq ochiq turgan sessiyalar uchun).
  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next === 'active') runCheckIn();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [runCheckIn]);

  const closeCelebration = useCallback(() => setCelebration(HIDDEN), []);

  return { celebration, closeCelebration };
};
```

- [ ] **Step 2: TypeScript tekshiruvi**

Run: `npx tsc --noEmit`
Expected: Xato yo'q. `updateUserLocal` `authSlice` dan eksport qilinganligini (`src/store/slices/authSlice.ts:353`) va `state.auth.isLoggedIn` mavjudligini tasdiqlang.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDailyCheckIn.ts
git commit -m "feat(streak): add useDailyCheckIn hook (AppState + guard + redux)"
```

---

## Task 5: Hook'ni RootNavigator'ga ulash

**Files:**
- Modify: `src/navigation/RootNavigator.tsx`

Mas'uliyat: hook Provider/ThemeProvider ichida bo'lishi shart (App.tsx → ThemeProvider → RootNavigator). Hook'ni shu yerda chaqirib, modalni `NavigationContainer` yonida render qilamiz.

- [ ] **Step 1: Import'lar va hook chaqiruvini qo'shish**

`src/navigation/RootNavigator.tsx` boshiga importlarni qo'shing:

```ts
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import StreakCelebrationModal from '../components/gamification/StreakCelebrationModal';
```

Komponent ichida, `const { isLoggedIn } = ...` qatoridan keyin:

```ts
  const { celebration, closeCelebration } = useDailyCheckIn();
```

- [ ] **Step 2: Return'ni Fragment bilan o'rab, modalni qo'shish**

Mavjud `return ( <NavigationContainer>...</NavigationContainer> )` ni quyidagicha o'zgartiring:

```tsx
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="DailyChallenge"
                component={DailyChallengeScreen}
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StreakCelebrationModal
        visible={celebration.visible}
        streak={celebration.streak}
        variant={celebration.variant}
        onClose={closeCelebration}
      />
    </>
  );
```

- [ ] **Step 3: TypeScript tekshiruvi**

Run: `npx tsc --noEmit`
Expected: Xato yo'q.

- [ ] **Step 4: Ilovani ishga tushirib qo'lda tekshirish**

Run: `npx expo start --offline`
Tekshiring:
1. Ilova buzilmasdan ochiladi (endpoint 404 bo'lsa ham — konsolda jim xato, modal yo'q).
2. Tizimga kirilgan holatda Home ekranidagi streak soni o'zgarmaydi/buzilmaydi.
3. (Backend tayyor bo'lsa) birinchi kun → modal "Olov yonyapti" chiqadi; o'sha kun ilovani qayta ochsangiz modal qayta chiqmaydi.

- [ ] **Step 5: Commit**

```bash
git add src/navigation/RootNavigator.tsx
git commit -m "feat(streak): wire daily check-in hook and celebration modal into root"
```

---

## O'z-o'zini tekshirish (reja yozuvchisi)

**Spec qamrovi (2026-06-01 dizayni):**
- `xpApi.checkIn()` → Task 1 ✅
- AppState + AsyncStorage guard (kuniga 1 marta) → Task 2 + Task 4 ✅
- Faqat `isLoggedIn` da chaqirish → Task 4 ✅
- Offline/xato → jim o'tish, sana saqlanmaydi → Task 4 `catch` ✅
- Streakni Redux'ga yozish (Home/Profil yangilanadi) → Task 4 `updateUserLocal` ✅
- Modal (`increased`/`freezeUsed`), 3 variant matni (oshish/freeze/restart) → Task 3 + Task 4 ✅
- `triggerHaptic('success')`, `useTheme()` ranglari → Task 3 + Task 4 ✅
- Server vaqti anti-cheat → backend mas'uliyati (ustoz), mobil tomonda qamrab bo'lmaydi ✅

**Dizayndan ataylab chetlanish:** Lottie olov animatsiyasi o'rniga `flame` Ionicon ishlatiladi (loyihada Lottie JSON asset yo'q; YAGNI). Funksionallik bir xil, keyin asset qo'shilsa almashtirsa bo'ladi.

**Placeholder skani:** Yo'q — har qadamda to'liq kod bor.

**Tip izchilligi:** `StreakVariant` Task 3 da eksport qilinadi, Task 4 da import qilinadi. `updateUserLocal` `authSlice` dan keladi. `checkIn` Task 1 da qo'shiladi, Task 4 da ishlatiladi. Izchil ✅.
