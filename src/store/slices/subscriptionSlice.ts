import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../api/subscriptionApi';

interface SubscriptionStatus {
  telegram: { subscribed: boolean; username?: string; verifiedAt?: string };
  instagram: { subscribed: boolean; username?: string; verifiedAt?: string };
  hasFullAccess: boolean;
}

interface SubscriptionState {
  status: SubscriptionStatus | null;
  loading: boolean;
  verifying: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  status: null,
  loading: false,
  verifying: false,
  error: null,
};

export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getStatus();
      return response.data?.data ?? response.data ?? null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Obuna statusini yuklab bo\'lmadi'
      );
    }
  }
);

export const verifyTelegramSubscription = createAsyncThunk(
  'subscription/verifyTelegram',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.verifyTelegram({ username });
      return response.data?.data ?? response.data ?? null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Telegram obunasini tasdiqlab bo\'lmadi'
      );
    }
  }
);

export const verifyInstagramSubscription = createAsyncThunk(
  'subscription/verifyInstagram',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.verifyInstagram({ username });
      return response.data?.data ?? response.data ?? null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Instagram obunasini tasdiqlab bo\'lmadi'
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyTelegramSubscription.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyTelegramSubscription.fulfilled, (state, action) => {
        state.verifying = false;
        if (action.payload) state.status = action.payload;
      })
      .addCase(verifyTelegramSubscription.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload as string;
      })
      .addCase(verifyInstagramSubscription.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyInstagramSubscription.fulfilled, (state, action) => {
        state.verifying = false;
        if (action.payload) state.status = action.payload;
      })
      .addCase(verifyInstagramSubscription.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
