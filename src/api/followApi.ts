import axiosInstance from './axiosInstance';

export const followApi = {
  // Foydalanuvchiga obuna bo'lish / obunani bekor qilish
  followUser: (userId: string) => axiosInstance.post(`/follow/${userId}`),
  unfollowUser: (userId: string) => axiosInstance.delete(`/follow/${userId}`),

  // O'zimning followerlar va following ro'yxati
  getMyFollowers: () => axiosInstance.get('/follow/my/followers'),
  getMyFollowing: () => axiosInstance.get('/follow/my/following'),

  // Boshqa foydalanuvchining public profili
  getUserProfile: (userId: string) => axiosInstance.get(`/follow/profile/${userId}`),

  // Foydalanuvchini follow qilganmizmi tekshirish
  checkFollowStatus: (userId: string) => axiosInstance.get(`/follow/status/${userId}`),
};
