import axiosInstance from './axiosInstance';

export const paymentApi = {
  // To'lovni boshlash (Payme yoki Click)
  initiatePayment: (data: {
    courseId: string;
    provider: 'payme' | 'click';
    amount: number;
  }) => axiosInstance.post('/payments/initiate', data),

  // Payme callback
  paymeCallback: (data: any) => axiosInstance.post('/payments/payme', data),

  // Click callback
  clickPrepare: (data: any) => axiosInstance.post('/payments/click/prepare', data),
  clickComplete: (data: any) => axiosInstance.post('/payments/click/complete', data),

  // To'lov tarixini olish
  getPaymentHistory: () => axiosInstance.get('/payments/history'),

  // To'lov statusini tekshirish
  getPaymentStatus: (paymentId: string) =>
    axiosInstance.get(`/payments/${paymentId}/status`),
};
