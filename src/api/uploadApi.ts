import axiosInstance from './axiosInstance';

export const uploadApi = {
  // Avatar rasmini yuklash (multipart/form-data)
  uploadAvatar: (formData: FormData) =>
    axiosInstance.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
