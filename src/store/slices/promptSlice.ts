import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promptApi } from '../../api/promptApi';

export const fetchPrompts = createAsyncThunk(
  'prompt/fetchPrompts',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await promptApi.getPrompts(params);
      return response.data?.data?.prompts ?? response.data?.prompts ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Promptlarni yuklab bo\'lmadi');
    }
  }
);

export const fetchFeaturedPrompts = createAsyncThunk(
  'prompt/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await promptApi.getFeaturedPrompts();
      const raw = response.data?.data;
      return Array.isArray(raw) ? raw : (raw?.prompts ?? []);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Featured promptlarni yuklab bo\'lmadi');
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
        state.prompts = action.payload as any;
      })
      .addCase(fetchPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchFeaturedPrompts.fulfilled, (state, action) => {
        state.featured = action.payload as any;
      });
  },
});

export default promptSlice.reducer;
