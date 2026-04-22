import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { storage } from '../../utils/storage';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const pickError = (error: any, fallback: string): string => {
  const msg = error?.response?.data?.message;
  if (typeof msg === 'string' && msg.length > 0) return msg;
  if (error?.message === 'Network Error') return 'Internet aloqasini tekshiring';
  return fallback;
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const user = response.data?.data?.user ?? response.data?.user ?? null;
      const token = await storage.getToken();
      if (!user || !token) {
        return rejectWithValue('Kirishda xatolik yuz berdi');
      }
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(pickError(error, 'Email yoki parol noto\'g\'ri'));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const user = response.data?.data?.user ?? response.data?.user ?? null;
      const token = await storage.getToken();
      if (!user || !token) {
        return rejectWithValue('Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(pickError(error, 'Ro\'yxatdan o\'tish amalga oshmadi'));
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();
      if (!token) return null;
      const response = await axiosInstance.get('/auth/me');
      const user = response.data?.data?.user ?? response.data?.data ?? null;
      if (!user) {
        await storage.clearTokens();
        return rejectWithValue('Sessiya muddati tugagan');
      }
      return { user, token };
    } catch (error: any) {
      await storage.clearTokens();
      return rejectWithValue('Sessiya muddati tugagan');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      storage.clearTokens();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || 'Kirish amalga oshmadi';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || 'Ro\'yxatdan o\'tishda xatolik';
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLoggedIn = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
