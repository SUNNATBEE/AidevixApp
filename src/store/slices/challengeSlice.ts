import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { challengeApi } from '../../api/challengeApi';

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  color: string;
  progress: number;
  target: number;
  status: 'done' | 'in_progress' | 'not_started';
}

interface ChallengeState {
  todayChallenges: Challenge[];
  totalReward: number;
  earnedReward: number;
  loading: boolean;
  error: string | null;
}

const initialState: ChallengeState = {
  todayChallenges: [],
  totalReward: 0,
  earnedReward: 0,
  loading: false,
  error: null,
};

const calcRewards = (challenges: Challenge[]) => ({
  totalReward: challenges.reduce((sum, c) => sum + c.reward, 0),
  earnedReward: challenges
    .filter((c) => c.status === 'done')
    .reduce((sum, c) => sum + c.reward, 0),
});

export const fetchTodayChallenges = createAsyncThunk(
  'challenge/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await challengeApi.getTodayChallenges();
      return response.data?.data?.challenges ?? response.data?.challenges ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Challengelarni yuklab bo\'lmadi'
      );
    }
  }
);

export const fetchChallengeProgress = createAsyncThunk(
  'challenge/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await challengeApi.getProgress();
      return response.data?.data?.challenges ?? response.data?.challenges ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Progress yuklab bo\'lmadi'
      );
    }
  }
);

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    clearChallengeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.todayChallenges = action.payload;
        const { totalReward, earnedReward } = calcRewards(action.payload);
        state.totalReward = totalReward;
        state.earnedReward = earnedReward;
      })
      .addCase(fetchTodayChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChallengeProgress.fulfilled, (state, action) => {
        state.todayChallenges = action.payload;
        const { totalReward, earnedReward } = calcRewards(action.payload);
        state.totalReward = totalReward;
        state.earnedReward = earnedReward;
      });
  },
});

export const { clearChallengeError } = challengeSlice.actions;
export default challengeSlice.reducer;
