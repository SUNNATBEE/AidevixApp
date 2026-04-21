import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../../api/courseApi';
import { Course } from '../../types/course';

interface CourseState {
  courses: Course[];
  topCourses: Course[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  topCourses: [],
  categories: [],
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCourses(params);
      return response.data.courses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchTopCourses = createAsyncThunk(
  'course/fetchTopCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseApi.getTopCourses();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top courses');
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopCourses.fulfilled, (state, action) => {
        state.topCourses = action.payload;
      });
  },
});

export default courseSlice.reducer;
