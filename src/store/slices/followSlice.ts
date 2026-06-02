import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { followApi } from '../../api/followApi';

export interface FollowUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rankTitle?: string;
  xp?: number;
}

interface FollowState {
  followers: FollowUser[];
  following: FollowUser[];
  followingIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowState = {
  followers: [],
  following: [],
  followingIds: [],
  loading: false,
  error: null,
};

export const fetchMyFollowers = createAsyncThunk(
  'follow/fetchFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await followApi.getMyFollowers();
      return response.data?.data?.followers ?? response.data?.followers ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Followerlarni yuklab bo\'lmadi'
      );
    }
  }
);

export const fetchMyFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await followApi.getMyFollowing();
      return response.data?.data?.following ?? response.data?.following ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Following ro\'yxatini yuklab bo\'lmadi'
      );
    }
  }
);

// Optimistik toggle: pending'da darrov flip, rejected'da revert
export const toggleFollow = createAsyncThunk(
  'follow/toggle',
  async (
    { userId }: { userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { follow: FollowState };
    const isFollowing = state.follow.followingIds.includes(userId);
    try {
      if (isFollowing) {
        await followApi.unfollowUser(userId);
      } else {
        await followApi.followUser(userId);
      }
      return { userId, followed: !isFollowing };
    } catch (error: any) {
      return rejectWithValue({
        userId,
        wasFollowing: isFollowing,
        message: error.response?.data?.message || 'Amalni bajarib bo\'lmadi',
      });
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchMyFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
        state.followingIds = action.payload.map((u: FollowUser) => u._id);
      })
      // Optimistik: so'rov ketishidan oldin UI yangilanadi
      .addCase(toggleFollow.pending, (state, action) => {
        const { userId } = action.meta.arg;
        if (state.followingIds.includes(userId)) {
          state.followingIds = state.followingIds.filter((id) => id !== userId);
          state.following = state.following.filter((u) => u._id !== userId);
        } else {
          state.followingIds.push(userId);
        }
      })
      // Xato: optimistik o'zgarishni qaytaramiz
      .addCase(toggleFollow.rejected, (state, action) => {
        const payload = action.payload as any;
        if (payload) {
          if (payload.wasFollowing && !state.followingIds.includes(payload.userId)) {
            state.followingIds.push(payload.userId);
          } else if (!payload.wasFollowing) {
            state.followingIds = state.followingIds.filter((id) => id !== payload.userId);
            state.following = state.following.filter((u) => u._id !== payload.userId);
          }
          state.error = payload.message ?? 'Amalni bajarib bo\'lmadi';
        }
      });
  },
});

export const { clearFollowError } = followSlice.actions;
export default followSlice.reducer;
