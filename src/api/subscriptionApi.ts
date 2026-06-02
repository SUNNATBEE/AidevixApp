import axiosInstance from './axiosInstance';

export const subscriptionApi = {
  // Telegram obunasini tekshirish va tasdiqlash
  verifyTelegram: (data: { username: string }) =>
    axiosInstance.post('/subscriptions/verify-telegram', data),

  // Instagram obunasini tekshirish va tasdiqlash
  verifyInstagram: (data: { username: string }) =>
    axiosInstance.post('/subscriptions/verify-instagram', data),

  // Obuna statusini olish (telegram + instagram)
  getStatus: () => axiosInstance.get('/subscriptions/status'),
};
