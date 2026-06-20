import { useState, useCallback, useEffect } from 'react';
import Constants from 'expo-constants';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useAppDispatch } from '../store/hooks';
import { googleLogin } from '../store/slices/authSlice';
import { triggerHaptic } from '../utils/haptics';

// Client ID'lar app.json → extra.googleAuth dan keladi (Google Cloud Console'dan).
const googleConfig = ((Constants.expoConfig?.extra as any)?.googleAuth ?? {}) as {
  webClientId?: string;
  androidClientId?: string;
  iosClientId?: string;
};

// Native Google Sign-In sozlamasi (brauzersiz — redirect_uri muammosi yo'q).
//   webClientId  = serverClientId. Qaytgan id_token AUDIENCE shu bo'ladi → backend
//                  GOOGLE_CLIENT_IDS ichida AYNAN shu Web client ID bo'lishi shart.
//   iosClientId  = iOS native client (iOS build uchun).
GoogleSignin.configure({
  webClientId: googleConfig.webClientId,
  iosClientId: googleConfig.iosClientId,
  offlineAccess: false,
});

/**
 * Google bilan kirish hook'i (native @react-native-google-signin).
 * signIn() Google native oynasini ochadi, id_token oladi va backend /auth/google ga yuboradi.
 */
export const useGoogleAuth = (referralCode?: string) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  // DIAGNOSTIKA: konfiguratsiya to'g'ri kelganini tekshirish.
  useEffect(() => {
    console.log('[GOOGLE-AUTH] webClientId =', googleConfig.webClientId);
    if (!googleConfig.webClientId) {
      console.warn('[GOOGLE-AUTH] webClientId yo\'q! app.json → extra.googleAuth.webClientId ni to\'ldiring.');
    }
  }, []);

  const signIn = useCallback(async () => {
    triggerHaptic('light');
    setSubmitting(true);
    try {
      // Play Services mavjudligini tekshiramiz (Android).
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const result = await GoogleSignin.signIn();

      // Kutubxona versiyalari bo'yicha id_token ikki shaklda kelishi mumkin:
      //   v13+: { type: 'success', data: { idToken, ... } }
      //   eski: { idToken, ... }
      const idToken =
        (result as any)?.data?.idToken ?? (result as any)?.idToken ?? null;

      // v13+ bekor qilishni type bilan bildiradi.
      if ((result as any)?.type === 'cancelled') {
        console.log('[GOOGLE-AUTH] foydalanuvchi bekor qildi');
        return;
      }

      if (!idToken) {
        console.warn('[GOOGLE-AUTH] id_token topilmadi:', JSON.stringify(result).slice(0, 300));
        triggerHaptic('error');
        return;
      }

      console.log('[GOOGLE-AUTH] id_token olindi, backendga yuborilmoqda...');
      await dispatch(googleLogin({ idToken, referralCode })).unwrap();
      // Muvaffaqiyat → RootNavigator isLoggedIn bo'yicha avtomatik o'tadi.
    } catch (error: any) {
      // Bekor qilish xato emas — faqat haqiqiy xatoda signal beramiz.
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('[GOOGLE-AUTH] bekor qilindi');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        console.log('[GOOGLE-AUTH] sign-in allaqachon davom etmoqda');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.warn('[GOOGLE-AUTH] Google Play Services mavjud emas/eskirgan');
        triggerHaptic('error');
      } else {
        console.warn('[GOOGLE-AUTH] xato:', error?.code, error?.message);
        triggerHaptic('error');
      }
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, referralCode]);

  return { signIn, loading: submitting, disabled: false };
};
