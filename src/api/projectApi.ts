import axiosInstance from './axiosInstance';

export const projectApi = {
  // Kurs uchun amaliy loyihalarni olish
  getCourseProjects: (courseId: string) =>
    axiosInstance.get(`/projects/course/${courseId}`),

  // Loyihani bajarilgan deb belgilash
  completeProject: (projectId: string, data?: { githubUrl?: string; description?: string }) =>
    axiosInstance.post(`/projects/${projectId}/complete`, data ?? {}),

  // Foydalanuvchining barcha loyihalari
  getMyProjects: () => axiosInstance.get('/projects/my'),
};
