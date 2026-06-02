import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyEmailCode, login, resendVerificationCode, clearAuthError } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';
import { AuthStackParamList } from '../../navigation/types';

type VerifyEmailNav = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type VerifyEmailRoute = RouteProp<AuthStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<VerifyEmailNav>();
  const route = useRoute<VerifyEmailRoute>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const { email, password } = route.params;
  const [info, setInfo] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { code: '' },
  });

  // Boshqa auth ekranlaridan qolgan eski xatoni tozalaymiz
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = async (data: { code: string }) => {
    setInfo(null);
    try {
      await dispatch(verifyEmailCode({ email, code: data.code.trim() })).unwrap();
      triggerHaptic('success');
      // Email tasdiqlandi. Parol mavjud bo'lsa — avtomatik kiramiz.
      if (password) {
        await dispatch(login({ email, password })).unwrap().catch(() => {
          navigation.navigate('Login');
        });
      } else {
        navigation.navigate('Login');
      }
    } catch {
      triggerHaptic('error');
    }
  };

  const onResend = async () => {
    setInfo(null);
    // Dedicated endpoint — parol kerakmas, faqat email kifoya.
    // Backend enumeration'dan himoya uchun har doim muvaffaqiyat qaytaradi.
    await dispatch(resendVerificationCode({ email }));
    setInfo('Agar email tasdiqlanmagan bo\'lsa, yangi kod yuborildi');
    triggerHaptic('light');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 }}>
      <Text style={[styles.title, { color: colors.text }]}>Emailni tasdiqlang</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {email} manziliga yuborilgan 6 xonali kodni kiriting.
      </Text>

      <Controller
        control={control}
        name="code"
        rules={{
          required: 'Kodni kiriting',
          minLength: { value: 6, message: 'Kod 6 xonali bo\'lishi kerak' },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Tasdiqlash kodi"
            placeholder="123456"
            onChangeText={onChange}
            value={value}
            error={errors.code?.message}
            keyboardType="number-pad"
            maxLength={6}
          />
        )}
      />

      {info && <Text style={[styles.infoText, { color: colors.success }]}>{info}</Text>}
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

      <Button title="Tasdiqlash" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.button} />

      <TouchableOpacity onPress={onResend} style={styles.resend} disabled={loading}>
        <Text style={{ color: colors.primary }}>Kod kelmadimi? Qayta yuborish</Text>
      </TouchableOpacity>

      <Button
        title="Kirish sahifasiga qaytish"
        onPress={() => navigation.navigate('Login')}
        variant="ghost"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
    marginBottom: 12,
  },
  resend: {
    alignSelf: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default VerifyEmailScreen;
