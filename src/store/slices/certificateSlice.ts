import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { certificateApi } from '../../api/certificateApi';

export interface Certificate {
  _id: string;
  code: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  downloadUrl?: string;
}

interface CertificateState {
  items: Certificate[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMyCertificates = createAsyncThunk(
  'certificate/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await certificateApi.getMyCertificates();
      return response.data?.data?.certificates ?? response.data?.certificates ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Sertifikatlarni yuklab bo\'lmadi'
      );
    }
  }
);

export const verifyCertificate = createAsyncThunk(
  'certificate/verify',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await certificateApi.verifyCertificate(code);
      return response.data?.data?.certificate ?? response.data?.certificate ?? null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Sertifikat topilmadi'
      );
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    clearCertificateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCertificateError } = certificateSlice.actions;
export default certificateSlice.reducer;
