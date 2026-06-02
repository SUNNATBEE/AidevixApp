import axiosInstance from './axiosInstance';

export const enrollmentApi = {
  // Foydalanuvchining barcha enrollmentlari
  getMyEnrollments: () => axiosInstance.get('/enrollments/my'),

  // Kursni davom ettirish (oxirgi ko'rilgan video)
  continueEnrollment: (enrollmentId: string) =>
    axiosInstance.get(`/enrollments/${enrollmentId}/continue`),

  // Enrollment progressini olish
  getProgress: (enrollmentId: string) =>
    axiosInstance.get(`/enrollments/${enrollmentId}/progress`),

  // Kursga yozilish (bepul kurslar uchun)
  enroll: (courseId: string) =>
    axiosInstance.post('/enrollments', { courseId }),
};
