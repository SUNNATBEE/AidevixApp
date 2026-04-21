import axiosInstance from './axiosInstance';

export const courseApi = {
  getCourses: (params?: any) => axiosInstance.get('/courses', { params }),
  getCourseById: (id: string) => axiosInstance.get(`/courses/${id}`),
  getTopCourses: () => axiosInstance.get('/courses/top'),
  getCategories: () => axiosInstance.get('/courses/categories'),
  getRecommended: (id: string) => axiosInstance.get(`/courses/${id}/recommended`),
  rateCourse: (id: string, rating: number) => axiosInstance.post(`/courses/${id}/rate`, { rating }),
};
