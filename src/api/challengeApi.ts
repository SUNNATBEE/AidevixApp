import axiosInstance from './axiosInstance';

export const challengeApi = {
  // Bugungi challenge — backend yakka DailyChallenge + progress qaytaradi:
  // GET /challenges/today → { data: { challenge, progress } }
  getTodayChallenges: () => axiosInstance.get('/challenges/today'),

  // Challenge progressini oshirish — backend bugungi challenge'ni server tomonida
  // aniqlaydi, param/body kerak emas: POST /challenges/progress
  updateProgress: () => axiosInstance.post('/challenges/progress'),
};
