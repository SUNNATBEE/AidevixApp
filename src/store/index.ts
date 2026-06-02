import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import certificateReducer from './slices/certificateSlice';
import challengeReducer from './slices/challengeSlice';
import chatReducer from './slices/chatSlice';
import courseReducer from './slices/courseSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import followReducer from './slices/followSlice';
import offlineReducer from './slices/offlineSlice';
import promptReducer from './slices/promptSlice';
import rankingReducer from './slices/rankingSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    prompt: promptReducer,
    ranking: rankingReducer,
    chat: chatReducer,
    offline: offlineReducer,
    wishlist: wishlistReducer,
    certificate: certificateReducer,
    follow: followReducer,
    challenge: challengeReducer,
    enrollment: enrollmentReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
