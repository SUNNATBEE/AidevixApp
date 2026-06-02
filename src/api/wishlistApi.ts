import axiosInstance from './axiosInstance';

export const wishlistApi = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  addToWishlist: (courseId: string) => axiosInstance.post(`/wishlist/${courseId}`),
  removeFromWishlist: (courseId: string) => axiosInstance.delete(`/wishlist/${courseId}`),
};
