import axiosInstance from './axiosInstance';

export const searchApi = {
  // Kurs nomi bo'yicha autocomplete (qidiruv inputi uchun)
  autocomplete: (query: string) =>
    axiosInstance.get('/courses/autocomplete', { params: { q: query } }),

  // Video qidiruv
  searchVideos: (params: { q: string; courseId?: string; page?: number; limit?: number }) =>
    axiosInstance.get('/videos/search', { params }),

  // Kurs qidiruv (to'liq)
  searchCourses: (params: { q: string; category?: string; level?: string; page?: number; limit?: number }) =>
    axiosInstance.get('/courses', { params }),
};
