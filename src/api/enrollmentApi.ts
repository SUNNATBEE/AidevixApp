import axiosInstance from './axiosInstance';

export const enrollmentApi = {
  // Foydalanuvchining barcha enrollmentlari
  getMyEnrollments: () => axiosInstance.get('/enrollments/my'),

  // Davom ettirish — backend global "continue-learning" (param qabul qilmaydi):
  // GET /enrollments/continue
  continueEnrollment: () => axiosInstance.get('/enrollments/continue'),

  // Kurs progressini olish — backend GET /enrollments/:courseId/progress
  getProgress: (courseId: string) =>
    axiosInstance.get(`/enrollments/${courseId}/progress`),

  // Kursga yozilish — backend POST /enrollments/:courseId (courseId path'da)
  enroll: (courseId: string) =>
    axiosInstance.post(`/enrollments/${courseId}`),
};
