import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { promptApi } from '../../api/promptApi';

export type PromptFilter = 'all' | 'liked';

export interface Prompt {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  likes?: string[];
  likesCount?: number;
  isLiked?: boolean;
  author?: any;
  createdAt?: string;
}

interface PromptState {
  prompts: Prompt[];
  featured: Prompt[];
  filter: PromptFilter;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: PromptState = {
  prompts: [],
  featured: [],
  filter: 'all',
  loading: false,
  refreshing: false,
  error: null,
};

const extractPrompts = (resp: any): Prompt[] => {
  const root = resp?.data?.data ?? resp?.data ?? {};
  if (Array.isArray(root)) return root;
  return root?.prompts ?? [];
};

export const fetchPrompts = createAsyncThunk(
  'prompt/fetchPrompts',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await promptApi.getPrompts(params);
      return extractPrompts(response);
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
      return extractPrompts(response);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Featured promptlarni yuklab bo\'lmadi');
    }
  }
);

// Optimistik yondashuv: avval lokal state'ni o'zgartirib, foydalanuvchiga
// instant feedback beramiz. Keyin API chaqiramiz. Agar xato bo'lsa — qaytaramiz.
// Bu pattern darslik o'rganuvchi UI uchun muhim — sekin tarmoqda ham reaktiv tuyuladi.
export const toggleLikePrompt = createAsyncThunk(
  'prompt/toggleLike',
  async (
    { promptId, userId }: { promptId: string; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await promptApi.toggleLike(promptId);
      const data = response.data?.data ?? response.data ?? {};
      return {
        promptId,
        isLiked: typeof data.isLiked === 'boolean' ? data.isLiked : undefined,
        likesCount: typeof data.likesCount === 'number' ? data.likesCount : undefined,
        userId,
      };
    } catch (error: any) {
      return rejectWithValue({
        promptId,
        userId,
        message: error.response?.data?.message || 'Like bosishda xatolik',
      });
    }
  }
);

const applyToggle = (state: PromptState, promptId: string, userId?: string) => {
  const flip = (p: Prompt): Prompt => {
    if (p._id !== promptId) return p;
    const currentlyLiked =
      p.isLiked ?? (userId ? (p.likes ?? []).includes(userId) : false);
    const nextLiked = !currentlyLiked;
    const baseCount = p.likesCount ?? (p.likes?.length ?? 0);
    const nextCount = Math.max(0, baseCount + (nextLiked ? 1 : -1));
    let nextLikes = p.likes;
    if (userId && Array.isArray(p.likes)) {
      nextLikes = nextLiked
        ? Array.from(new Set([...p.likes, userId]))
        : p.likes.filter((id) => id !== userId);
    }
    return { ...p, isLiked: nextLiked, likesCount: nextCount, likes: nextLikes };
  };
  state.prompts = state.prompts.map(flip);
  state.featured = state.featured.map(flip);
};

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<PromptFilter>) => {
      state.filter = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrompts.pending, (state) => {
        state.loading = state.prompts.length === 0 && !state.refreshing;
        state.error = null;
      })
      .addCase(fetchPrompts.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.prompts = action.payload as Prompt[];
      })
      .addCase(fetchPrompts.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedPrompts.fulfilled, (state, action) => {
        state.featured = action.payload as Prompt[];
      })
      // Optimistik flip — request ketishidan oldin UI yangilanadi.
      .addCase(toggleLikePrompt.pending, (state, action) => {
        const { promptId, userId } = action.meta.arg;
        applyToggle(state, promptId, userId);
      })
      // Server javob bersa — agar aniq qiymat qaytsa, o'sha qiymatni qo'llaymiz.
      // Aks holda lokal holatni saqlab qolamiz (zaten optimistik to'g'ri).
      .addCase(toggleLikePrompt.fulfilled, (state, action) => {
        const { promptId, isLiked, likesCount } = action.payload;
        const apply = (p: Prompt): Prompt => {
          if (p._id !== promptId) return p;
          return {
            ...p,
            isLiked: typeof isLiked === 'boolean' ? isLiked : p.isLiked,
            likesCount: typeof likesCount === 'number' ? likesCount : p.likesCount,
          };
        };
        state.prompts = state.prompts.map(apply);
        state.featured = state.featured.map(apply);
      })
      // Xato bo'lsa — optimistik flip'ni qaytaramiz.
      .addCase(toggleLikePrompt.rejected, (state, action) => {
        const payload = action.payload as { promptId: string; userId?: string; message?: string };
        if (payload?.promptId) {
          applyToggle(state, payload.promptId, payload.userId);
          state.error = payload.message ?? 'Like bosishda xatolik';
        }
      });
  },
});

export const { setFilter, setRefreshing } = promptSlice.actions;
export default promptSlice.reducer;
