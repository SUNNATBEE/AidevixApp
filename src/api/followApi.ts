import axiosInstance from './axiosInstance';

export const followApi = {
  // Foydalanuvchiga obuna bo'lish / obunani bekor qilish
  followUser: (userId: string) => axiosInstance.post(`/follow/${userId}`),
  unfollowUser: (userId: string) => axiosInstance.delete(`/follow/${userId}`),

  // O'zimning followerlar va following ro'yxati
  getMyFollowers: () => axiosInstance.get('/follow/my/followers'),
  getMyFollowing: () => axiosInstance.get('/follow/my/following'),

  // Follow statistikasi — backend GET /follow/:userId/stats
  // Javob: { followers, following, isFollowing }
  getUserProfile: (userId: string) => axiosInstance.get(`/follow/${userId}/stats`),

  // Follow holatini tekshirish — xuddi shu stats endpoint isFollowing qaytaradi
  checkFollowStatus: (userId: string) => axiosInstance.get(`/follow/${userId}/stats`),
};
