import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../../api/wishlistApi';
import { Course } from '../../types/course';

interface WishlistState {
  ids: string[];
  items: Course[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  ids: [],
  items: [],
  loading: false,
  refreshing: false,
  error: null,
};

// Backend javobidan populate qilingan kurslarni ajratib oladi.
// courseId === null (o'chirilgan kurs) bo'lganlar filtrlanadi.
const extractCourses = (resp: any): Course[] => {
  const courses = resp?.data?.data?.courses ?? resp?.data?.courses ?? [];
  return courses
    .map((c: any) => c?.courseId)
    .filter((c: any): c is Course => !!c && !!c._id);
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist();
      return extractCourses(response);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Sevimlilarni yuklab bo\'lmadi'
      );
    }
  }
);

// Optimistik toggle: pending'da darrov flip, rejected'da revert.
// `course` to'liq obyekt sifatida uzatiladi — qo'shganda items'ga kiritish uchun.
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (
    { course }: { course: Course },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { wishlist: WishlistState };
    const wasInList = state.wishlist.ids.includes(course._id);
    try {
      if (wasInList) {
        await wishlistApi.removeFromWishlist(course._id);
      } else {
        await wishlistApi.addToWishlist(course._id);
      }
      return { courseId: course._id, added: !wasInList };
    } catch (error: any) {
      return rejectWithValue({
        courseId: course._id,
        wasInList,
        message: error.response?.data?.message || 'Amalni bajarib bo\'lmadi',
      });
    }
  }
);

const addLocally = (state: WishlistState, course: Course) => {
  if (!state.ids.includes(course._id)) {
    state.ids.push(course._id);
    state.items.unshift(course);
  }
};

const removeLocally = (state: WishlistState, courseId: string) => {
  state.ids = state.ids.filter((id) => id !== courseId);
  state.items = state.items.filter((c) => c._id !== courseId);
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setRefreshing: (state, action: { payload: boolean }) => {
      state.refreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = state.items.length === 0 && !state.refreshing;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload;
        state.ids = action.payload.map((c) => c._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      })
      // Optimistik: so'rov ketishidan oldin UI yangilanadi.
      .addCase(toggleWishlist.pending, (state, action) => {
        const course = action.meta.arg.course;
        if (state.ids.includes(course._id)) {
          removeLocally(state, course._id);
        } else {
          addLocally(state, course);
        }
      })
      // Xato: optimistik o'zgarishni qaytaramiz.
      .addCase(toggleWishlist.rejected, (state, action) => {
        const payload = action.payload as {
          courseId: string;
          wasInList: boolean;
          message?: string;
        };
        if (payload) {
          // wasInList=true edi va biz o'chirgan edik → qaytaramiz (lekin Course obyekti yo'q).
          // wasInList=false edi va biz qo'shgan edik → o'chiramiz.
          if (payload.wasInList) {
            // To'liq tiklash uchun keyingi fetchWishlist mas'ul.
            if (!state.ids.includes(payload.courseId)) {
              state.ids.push(payload.courseId);
            }
          } else {
            removeLocally(state, payload.courseId);
          }
          state.error = payload.message ?? 'Amalni bajarib bo\'lmadi';
        }
      });
  },
});

export const { setRefreshing } = wishlistSlice.actions;
export default wishlistSlice.reducer;
