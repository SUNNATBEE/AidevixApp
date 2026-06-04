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
