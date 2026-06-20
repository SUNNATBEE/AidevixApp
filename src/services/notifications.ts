import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Ilova ochiq turganda ham banner/ovoz ko'rsatish
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STREAK_ID = 'daily-streak-reminder';

// Ruxsat so'rash + Android kanal yaratish. App start'da bir marta chaqiriladi.
export async function initNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Eslatmalar',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    finalStatus = req.status;
  }
  if (finalStatus !== 'granted') return false;

  await scheduleDailyStreakReminder(20, 0); // har kuni 20:00 da
  return true;
}

// Har kuni belgilangan vaqtda streak eslatmasi (takrorlanadi)
export async function scheduleDailyStreakReminder(hour = 20, minute = 0) {
  // Avval eskisini o'chir (dublikat bo'lmasligi uchun)
  await Notifications.cancelScheduledNotificationAsync(STREAK_ID).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_ID,
    content: {
      title: '🔥 Streak\'ingni saqlab qol!',
      body: 'Bugun hali check-in qilmading. Kirib XP yig\'ib ket!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// Bir martalik eslatma (masalan kunlik challenge uchun) — soniyalardan keyin
export async function scheduleOneTime(title: string, body: string, seconds: number) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}

// Streak eslatmasini o'chirish (sozlamalarda toggle uchun)
export async function cancelStreakReminder() {
  await Notifications.cancelScheduledNotificationAsync(STREAK_ID).catch(() => {});
}
