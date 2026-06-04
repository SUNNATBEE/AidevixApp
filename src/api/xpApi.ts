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
