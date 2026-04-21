import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promptApi } from '../../api/promptApi';

export const fetchPrompts = createAsyncThunk(
  'prompt/fetchPrompts',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await promptApi.getPrompts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prompts');
    }
  }
);

const promptSlice = createSlice({
  name: 'prompt',
  initialState: {
    prompts: [],
    featured: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrompts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrompts.fulfilled, (state, action) => {
        state.loading = false;
        state.prompts = action.payload.prompts;
      })
      .addCase(fetchPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default promptSlice.reducer;
