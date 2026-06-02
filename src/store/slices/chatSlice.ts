import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  error?: boolean;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const buildWelcome = (): Message => ({
  id: 'welcome',
  role: 'assistant',
  content:
    'Salom! Men AICoach. Dasturlash bo\'yicha har qanday savol bering — kod, xato, konsept — hammasiga yordam beraman.',
  timestamp: Date.now(),
});

const initialState: ChatState = {
  messages: [buildWelcome()],
  loading: false,
  error: null,
};

// Backend ba'zan {reply}, ba'zan {message}, ba'zan {data:{reply}} qaytaradi.
// Bitta joyda normalize qilamiz — playground AiHelperModal'da xuddi shu pattern.
const extractReply = (data: any): string => {
  const reply =
    data?.reply ??
    data?.message ??
    data?.data?.reply ??
    data?.data?.message ??
    data?.content;
  if (typeof reply === 'string' && reply.trim().length > 0) return reply;
  return 'Javob kelmadi';
};

const pickErrorMessage = (err: any): string => {
  if (err?.code === 'ECONNABORTED') return 'Javob juda sekin keldi (timeout). Qaytadan urinib ko\'ring.';
  if (err?.message === 'Network Error') return 'Internet aloqasini tekshiring';
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'AICoach javob bera olmadi'
  );
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (content: string, { rejectWithValue }) => {
    try {
      // Global axios timeout 15s — AI generatsiyasi 20-60s ketishi mumkin.
      // Shuning uchun shu chaqiruv uchun timeout'ni alohida 60s qilamiz.
      const response = await axiosInstance.post(
        '/ai/chat',
        { message: content },
        { timeout: 60000 }
      );
      return extractReply(response.data);
    } catch (error: any) {
      return rejectWithValue(pickErrorMessage(error));
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [buildWelcome()];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: `${Date.now()}-r`,
          role: 'assistant',
          content: action.payload,
          timestamp: Date.now(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        const errMsg = (action.payload as string) || 'AICoach javob bera olmadi';
        state.error = errMsg;
        // Xatoni chat bubble sifatida ham ko'rsatamiz — foydalanuvchi sukut emas,
        // aniq sabab ko'radi va qaytadan urinishi mumkin.
        state.messages.push({
          id: `${Date.now()}-e`,
          role: 'assistant',
          content: `Xatolik: ${errMsg}`,
          timestamp: Date.now(),
          error: true,
        });
      });
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
