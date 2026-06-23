import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTodayChallenges } from '../store/slices/challengeSlice';
import { getLastCheckInKey, isNewDay, todayKey } from '../utils/checkInGuard';
import {
  refreshStreakReminders,
  refreshChallengeReminders,
  cancelStreakReminders,
  cancelChallengeReminders,
} from '../services/notifications';

/**
 * Lokal eslatmalarni holatga qarab boshqaradi (push token / server kerak emas):
 * - Streak: check-in qilingan kun o'tkazib yuboriladi.
 * - Challenge: bugungi challenge'lar bajarilgan bo'lsa bugungi kun o'tkazib yuboriladi.
 * Rolling window — har ochilganda keyingi kunlar uchun qayta rejalashtiriladi.
 */
export const useReminders = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const challenges = useAppSelector((s) => s.challenge.todayChallenges);

  const refreshStreak = useCallback(async () => {
    const checkedInToday = !isNewDay(await getLastCheckInKey(), todayKey());
    await refreshStreakReminders(checkedInToday);
  }, []);

  // Login holati: streak refresh + bugungi challenge'larni olish.
  // Chiqib ketsa — barcha eslatmalarni bekor qilamiz.
  useEffect(() => {
    if (!isLoggedIn) {
      cancelStreakReminders();
      cancelChallengeReminders();
      return;
    }
    refreshStreak();
    dispatch(fetchTodayChallenges());
  }, [isLoggedIn, dispatch, refreshStreak]);

  // Challenge holati o'zgarganda (bajarildi/yuklandi) challenge eslatmasini yangilaymiz.
  useEffect(() => {
    if (!isLoggedIn) return;
    const allDone = challenges.length > 0 && challenges.every((c) => c.status === 'done');
    refreshChallengeReminders(allDone);
  }, [isLoggedIn, challenges]);

  // Uzoq ochiq sessiyalarda old planga qaytganda window'ni to'ldiramiz.
  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next === 'active' && isLoggedIn) refreshStreak();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [isLoggedIn, refreshStreak]);
};
