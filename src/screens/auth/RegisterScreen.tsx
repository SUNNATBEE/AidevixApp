import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FadeInView from '../../components/common/FadeInView';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, login, clearAuthError } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';

const RegisterScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  // Login ekranidan qolgan eski xato xabarini tozalaymiz (state.auth.error global).
  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearAuthError());
    }, [dispatch])
  );

  const togglePasswordVisibility = () => {
    triggerHaptic('light');
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: any) => {
    try {
      const result = await dispatch(register(data)).unwrap();

      // 1-holat: backend darhol sessiya berdi (user + token) — RootNavigator app'ga o'tadi.
      if (!(result as any)?.requiresEmailVerification) return;

      // 2-holat: backend email tasdiqlashni talab qiladi.
      // Avval auto-login urinamiz — agar backend tasdiqlanmagan foydalanuvchini
      // qabul qilsa (yumshoq policy), foydalanuvchi VerifyEmail ekranisiz app'ga kiradi.
      try {
        await dispatch(login({ email: data.email, password: data.password })).unwrap();
        // Login muvaffaqiyatli — RootNavigator avtomatik app'ga o'tadi.
      } catch (loginErr: any) {
        // Auto-login muvaffaqiyatsiz. Agar email tasdiqlash kerak bo'lsa — fallback VerifyEmail.
        if (loginErr?.requiresEmailVerification) {
          navigation.navigate('VerifyEmail', {
            email: loginErr.email ?? data.email,
            password: data.password,
          });
        }
        // Boshqa xatolar authSlice.error orqali ekranda ko'rsatiladi.
      }
    } catch {
      // Register'ning o'zi muvaffaqiyatsiz — xato authSlice.error orqali ko'rsatiladi.
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <FadeInView delay={0}>
          <Text style={[styles.title, { color: colors.text }]}>Ro'yxatdan o'tish</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Aidevix oilasiga qo'shiling
          </Text>
        </FadeInView>

        <Controller
          control={control}
          name="username"
          rules={{ required: 'Username kiriting' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Username" placeholder="eshmat_dev" onChangeText={onChange} value={value} error={errors.username?.message as string} autoCapitalize="none" />
          )}
        />

        <Controller
          control={control}
          name="firstName"
          rules={{ required: 'Ismingizni kiriting' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Ism" placeholder="Eshmat" onChangeText={onChange} value={value} error={errors.firstName?.message as string} />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          rules={{ required: 'Familiyangizni kiriting' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Familiya" placeholder="Toshmatov" onChangeText={onChange} value={value} error={errors.lastName?.message as string} />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email kiriting' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Email" placeholder="mail@example.com" onChangeText={onChange} value={value} error={errors.email?.message as string} keyboardType="email-address" />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Parol kiriting',
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
              label="Parol"
              placeholder="Kamida 8 belgi, A-a-1-!"
              onChangeText={onChange}
              value={value}
              error={errors.password?.message as string}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
            />
          )}
        />

        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

        <Button title="Davom etish" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.button} />

        <GoogleSignInButton label="Google bilan ro'yxatdan o'tish" />

        <Button
          title="Kirish sahifasiga qaytish" 
          onPress={() => navigation.goBack()} 
          variant="ghost" 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
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
    marginTop: 16,
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default RegisterScreen;
