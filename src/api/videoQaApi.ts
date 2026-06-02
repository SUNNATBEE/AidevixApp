import axiosInstance from './axiosInstance';

export const videoQaApi = {
  // Video ostidagi savollarni olish
  getQuestions: (videoId: string) =>
    axiosInstance.get(`/videos/${videoId}/questions`),

  // Yangi savol qo'shish
  postQuestion: (videoId: string, data: { question: string }) =>
    axiosInstance.post(`/videos/${videoId}/questions`, data),

  // Savolga javob berish (admin yoki instructor)
  answerQuestion: (videoId: string, questionId: string, data: { answer: string }) =>
    axiosInstance.post(`/videos/${videoId}/questions/${questionId}/answer`, data),
};
