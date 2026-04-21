import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rankingApi } from '../../api/rankingApi';

export const fetchRanking = createAsyncThunk(
  'ranking/fetchRanking',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await rankingApi.getTopUsers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ranking');
    }
  }
);

const rankingSlice = createSlice({
  name: 'ranking',
  initialState: {
    users: [],
    currentUserPosition: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRanking.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchRanking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default rankingSlice.reducer;
