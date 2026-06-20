import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FadeInView from '../../components/common/FadeInView';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyResetCode, resetPassword, clearAuthError } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';
import { AuthStackParamList } from '../../navigation/types';

type ResetNav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetRoute = RouteProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<ResetNav>();
  const route = useRoute<ResetRoute>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { email } = route.params;

  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { code: '', newPassword: '' },
  });

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearAuthError());
      setInfo(null);
    }, [dispatch])
  );

  const onSubmit = async (data: { code: string; newPassword: string }) => {
    setInfo(null);

    // Bosqich 1: kodni tekshirib resetToken olamiz
    const verifyResult = await dispatch(verifyResetCode({ email, code: data.code.trim() }));
    if (!verifyResetCode.fulfilled.match(verifyResult)) {
      triggerHaptic('error');
      return;
    }
    const { resetToken } = verifyResult.payload;

    // Bosqich 2: resetToken bilan yangi parolni o'rnatamiz
    const resetResult = await dispatch(resetPassword({ resetToken, newPassword: data.newPassword }));
    if (resetPassword.fulfilled.match(resetResult)) {
      triggerHaptic('success');
      setInfo('Parol muvaffaqiyatli yangilandi. Endi yangi parol bilan kiring.');
      setTimeout(() => navigation.navigate('Login'), 1000);
    } else {
      triggerHaptic('error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <FadeInView delay={0}>
          <Text style={[styles.title, { color: colors.text }]}>Yangi parol</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {email} ga yuborilgan 6 xonali kodni va yangi parolni kiriting.
          </Text>
        </FadeInView>

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

        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: 'Yangi parol kiriting',
            minLength: { value: 8, message: 'Kamida 8ta belgi' },
            validate: (v: string) => {
              if (!/[A-Z]/.test(v)) return 'Kamida bitta katta harf bo\'lsin';
              if (!/[a-z]/.test(v)) return 'Kamida bitta kichik harf bo\'lsin';
              if (!/\d/.test(v)) return 'Kamida bitta raqam bo\'lsin';
              if (!/[^A-Za-z0-9]/.test(v)) return 'Kamida bitta maxsus belgi bo\'lsin (!@#...)';
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Yangi parol"
              placeholder="Kamida 8 belgi, A-a-1-!"
              onChangeText={onChange}
              value={value}
              error={errors.newPassword?.message}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={
                <TouchableOpacity onPress={() => { triggerHaptic('light'); setShowPassword((p) => !p); }} hitSlop={10}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              }
            />
          )}
        />

        {info && <Text style={[styles.infoText, { color: colors.success }]}>{info}</Text>}
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

        <Button title="Saqlash" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.button} />
        <Button title="Kirish sahifasiga qaytish" onPress={() => navigation.navigate('Login')} variant="ghost" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
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
  infoText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default ResetPasswordScreen;
