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
import { refreshStreakReminders } from '../services/notifications';
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

      // Bugun check-in bo'ldi — bugungi streak eslatmasini bekor qilamiz (bezovta qilmaslik).
      refreshStreakReminders(true).catch(() => {});

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
