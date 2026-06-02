import axiosInstance from './axiosInstance';

export const certificateApi = {
  // Foydalanuvchining barcha sertifikatlarini olish
  getMyCertificates: () => axiosInstance.get('/certificates/my'),

  // Sertifikatni yuklab olish (PDF yoki rasm)
  downloadCertificate: (code: string) =>
    axiosInstance.get(`/certificates/${code}/download`, { responseType: 'blob' }),

  // QR kod orqali sertifikatni tekshirish (auth talab qilinmaydi)
  verifyCertificate: (code: string) => axiosInstance.get(`/certificates/verify/${code}`),
};
