import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { rankingApi } from '../../api/rankingApi';

export type LeaderboardPeriod = 'weekly' | 'allTime';

export interface RankingUser {
  _id?: string;
  id?: string;
  user?: any;
  rank?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  xp?: number;
  weeklyXp?: number;
  rankTitle?: string;
}

export interface CurrentUserPosition {
  rank?: number;
  xp?: number;
  weeklyXp?: number;
  total?: number;
}

interface RankingState {
  users: RankingUser[];
  weeklyUsers: RankingUser[];
  period: LeaderboardPeriod;
  currentUserPosition: CurrentUserPosition | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: RankingState = {
  users: [],
  weeklyUsers: [],
  period: 'allTime',
  currentUserPosition: null,
  loading: false,
  refreshing: false,
  error: null,
};

// Backend ba'zan {data:{users:[]}}, ba'zan {users:[]}, ba'zan toza array qaytaradi.
// Bitta joyda normallashtirib, screen'da har xil shape'larni o'ylamaymiz.
const extractUsers = (resp: any): RankingUser[] => {
  const root = resp?.data?.data ?? resp?.data ?? {};
  if (Array.isArray(root)) return root;
  return root?.users ?? root?.leaderboard ?? [];
};

export const fetchRanking = createAsyncThunk(
  'ranking/fetchRanking',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await rankingApi.getTopUsers(params);
      return extractUsers(response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Reytingni yuklab bo\'lmadi');
    }
  }
);

export const fetchWeeklyRanking = createAsyncThunk(
  'ranking/fetchWeeklyRanking',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await rankingApi.getWeeklyLeaderboard();
      return extractUsers(response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Haftalik reytingni yuklab bo\'lmadi');
    }
  }
);

export const fetchUserPosition = createAsyncThunk(
  'ranking/fetchUserPosition',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await rankingApi.getUserPosition(userId);
      return (response.data?.data ?? response.data ?? null) as CurrentUserPosition | null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || null);
    }
  }
);

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<LeaderboardPeriod>) => {
      state.period = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRanking.pending, (state) => {
        state.loading = state.users.length === 0 && !state.refreshing;
        state.error = null;
      })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.users = action.payload;
      })
      .addCase(fetchRanking.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWeeklyRanking.pending, (state) => {
        state.loading = state.weeklyUsers.length === 0 && !state.refreshing;
        state.error = null;
      })
      .addCase(fetchWeeklyRanking.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.weeklyUsers = action.payload;
      })
      .addCase(fetchWeeklyRanking.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserPosition.fulfilled, (state, action) => {
        state.currentUserPosition = action.payload ?? null;
      });
  },
});

export const { setPeriod, setRefreshing } = rankingSlice.actions;
export default rankingSlice.reducer;
