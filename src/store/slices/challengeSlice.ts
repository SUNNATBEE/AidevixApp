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

// Backend challenge `type` → UI icon/color (modelda icon/color yo'q).
const TYPE_META: Record<string, { icon: string; color: string }> = {
  watch_video: { icon: 'play-circle', color: '#6366f1' },
  complete_quiz: { icon: 'checkbox', color: '#a855f7' },
  streak: { icon: 'flame', color: '#ef4444' },
  enroll_course: { icon: 'school', color: '#10b981' },
  rate_course: { icon: 'star', color: '#f59e0b' },
  use_ai_tool: { icon: 'sparkles', color: '#0ea5e9' },
  share_prompt: { icon: 'share-social', color: '#14b8a6' },
};

// Backend `{ challenge, progress }` (yakka) → mobil Challenge[] (bitta element).
const mapBackendChallenge = (data: any): Challenge[] => {
  const c = data?.challenge;
  if (!c) return [];
  const p = data?.progress ?? {};
  const target = c.targetCount ?? 1;
  const progress = p.currentCount ?? 0;
  const meta = TYPE_META[c.type] ?? { icon: 'trophy', color: '#6366f1' };
  const status: Challenge['status'] = p.isCompleted
    ? 'done'
    : progress > 0
    ? 'in_progress'
    : 'not_started';
  return [
    {
      _id: c._id,
      title: c.title,
      description: c.description,
      reward: c.xpReward ?? 0,
      icon: meta.icon,
      color: meta.color,
      progress,
      target,
      status,
    },
  ];
};

export const fetchTodayChallenges = createAsyncThunk(
  'challenge/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await challengeApi.getTodayChallenges();
      return mapBackendChallenge(response.data?.data ?? response.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Challengelarni yuklab bo\'lmadi'
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
      });
  },
});

export const { clearChallengeError } = challengeSlice.actions;
export default challengeSlice.reducer;
