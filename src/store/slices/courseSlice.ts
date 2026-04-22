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
      return response.data?.data?.courses ?? response.data?.courses ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kurslarni yuklab bo\'lmadi');
    }
  }
);

export const fetchTopCourses = createAsyncThunk(
  'course/fetchTopCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseApi.getTopCourses();
      return response.data?.data?.courses ?? response.data?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Top kurslarni yuklab bo\'lmadi');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'course/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCategories();
      return response.data?.data?.categories ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kategoriyalarni yuklab bo\'lmadi');
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
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.map((c: any) => (typeof c === 'string' ? c : c.name));
      });
  },
});

export default courseSlice.reducer;
