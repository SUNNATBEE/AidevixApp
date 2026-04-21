import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Video } from '../../types/course';

interface OfflineState {
  downloadedCourses: Course[];
  downloadedVideos: Video[];
  pendingSync: {
    videoIds: string[];
    quizResults: any[];
  };
}

const initialState: OfflineState = {
  downloadedCourses: [],
  downloadedVideos: [],
  pendingSync: {
    videoIds: [],
    quizResults: [],
  },
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addDownloadedCourse: (state, action: PayloadAction<Course>) => {
      if (!state.downloadedCourses.find(c => c._id === action.payload._id)) {
        state.downloadedCourses.push(action.payload);
      }
    },
    addDownloadedVideo: (state, action: PayloadAction<Video>) => {
      if (!state.downloadedVideos.find(v => v._id === action.payload._id)) {
        state.downloadedVideos.push(action.payload);
      }
    },
    removeDownloadedCourse: (state, action: PayloadAction<string>) => {
      state.downloadedCourses = state.downloadedCourses.filter(c => c._id !== action.payload);
      state.downloadedVideos = state.downloadedVideos.filter(v => v.course !== action.payload);
    },
    queueVideoSync: (state, action: PayloadAction<string>) => {
      state.pendingSync.videoIds.push(action.payload);
    },
    clearSyncQueue: (state) => {
      state.pendingSync = { videoIds: [], quizResults: [] };
    },
  },
});

export const { 
  addDownloadedCourse, 
  addDownloadedVideo, 
  removeDownloadedCourse,
  queueVideoSync,
  clearSyncQueue
} = offlineSlice.actions;

export default offlineSlice.reducer;
