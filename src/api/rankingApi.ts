import axiosInstance from './axiosInstance';

export const rankingApi = {
  getTopUsers: (params?: any) => axiosInstance.get('/ranking/users', { params }),
  getTopCourses: () => axiosInstance.get('/ranking/courses'),
  getUserPosition: (userId: string) => axiosInstance.get(`/ranking/users/${userId}/position`),
  getWeeklyLeaderboard: () => axiosInstance.get('/ranking/weekly'),
};
