import axiosInstance from './axiosInstance';

export const authApi = {
  register: (data: any) => axiosInstance.post('/auth/register', data),
  login: (data: any) => axiosInstance.post('/auth/login', data),
  googleLogin: (idToken: string, referralCode?: string) =>
    axiosInstance.post('/auth/google', { idToken, referralCode }),
  refreshToken: (refreshToken: string) => axiosInstance.post('/auth/refresh-token', { refreshToken }),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me'),
  dailyReward: () => axiosInstance.post('/auth/daily-reward'),
  forgotPassword: (email: string) => axiosInstance.post('/auth/forgot-password', { email }),
  verifyCode: (email: string, code: string) => axiosInstance.post('/auth/verify-code', { email, code }),
  resetPassword: (data: any) => axiosInstance.post('/auth/reset-password', data),
  getReferrals: () => axiosInstance.get('/auth/referrals'),
};
