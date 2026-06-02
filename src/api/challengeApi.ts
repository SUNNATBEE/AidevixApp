import axiosInstance from './axiosInstance';

export const challengeApi = {
  // Bugungi challengelarni olish
  getTodayChallenges: () => axiosInstance.get('/challenges/today'),

  // Foydalanuvchining challenge progressini olish
  getProgress: () => axiosInstance.get('/challenges/progress'),

  // Challenge progressini yangilash (masalan, dars ko'rilganda)
  updateProgress: (challengeId: string, data: { progress: number }) =>
    axiosInstance.post(`/challenges/${challengeId}/progress`, data),
};
