import axiosInstance from './axiosInstance';

export const promptApi = {
  getPrompts: (params?: any) => axiosInstance.get('/prompts', { params }),
  getFeaturedPrompts: () => axiosInstance.get('/prompts/featured'),
  getPromptById: (id: string) => axiosInstance.get(`/prompts/${id}`),
  createPrompt: (data: any) => axiosInstance.post('/prompts', data),
  toggleLike: (id: string) => axiosInstance.post(`/prompts/${id}/like`),
  deletePrompt: (id: string) => axiosInstance.delete(`/prompts/${id}`),
};
