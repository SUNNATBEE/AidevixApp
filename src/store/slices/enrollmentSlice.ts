import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { enrollmentApi } from '../../api/enrollmentApi';

export interface Enrollment {
  _id: string;
  courseId: string;
  courseTitle?: string;
  courseThumbnail?: string;
  progress: number;
  lastVideoId?: string;
  completedAt?: string;
  enrolledAt: string;
}

interface EnrollmentState {
  items: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  items: [],
  loading: false,
  error: null,
};

const extractEnrollments = (resp: any): Enrollment[] =>
  resp?.data?.data?.enrollments ?? resp?.data?.enrollments ?? [];

export const fetchMyEnrollments = createAsyncThunk(
  'enrollment/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentApi.getMyEnrollments();
      return extractEnrollments(response);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Enrollmentlarni yuklab bo\'lmadi'
      );
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'enrollment/enroll',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await enrollmentApi.enroll(courseId);
      return response.data?.data?.enrollment ?? response.data?.enrollment ?? null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Kursga yozilishda xatolik'
      );
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    clearEnrollmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        if (action.payload) {
          // Duplicate bo'lmasligi uchun tekshiramiz
          const exists = state.items.some((e) => e._id === action.payload._id);
          if (!exists) state.items.unshift(action.payload);
        }
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearEnrollmentError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
