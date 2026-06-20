import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { requestPasswordReset, clearAuthError } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';
import { AuthStackParamList } from '../../navigation/types';

const ForgotPasswordScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [info, setInfo] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: route.params?.email || '' },
  });

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearAuthError());
      setInfo(null);
    }, [dispatch])
  );

  const onSubmit = async (data: { email: string }) => {
    setInfo(null);
    const result = await dispatch(requestPasswordReset({ email: data.email.trim() }));
    if (requestPasswordReset.fulfilled.match(result)) {
      triggerHaptic('success');
      setInfo('Agar hisob mavjud bo\'lsa, emailingizga kod yuborildi');
      navigation.navigate('ResetPassword', { email: data.email.trim(), code: '' });
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
        <Text style={[styles.title, { color: colors.text }]}>Parolni tiklash</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Email manzilingizni kiriting, biz sizga 6 xonali tasdiqlash kodini yuboramiz.
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email kiriting',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email formati noto\'g\'ri' },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="mail@example.com"
              onChangeText={onChange}
              value={value}
              error={errors.email?.message as string}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />

        {info && <Text style={[styles.infoText, { color: colors.success }]}>{info}</Text>}
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

        <Button title="Kodni yuborish" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.button} />
        <Button title="Orqaga" onPress={() => navigation.goBack()} variant="ghost" />
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

export default ForgotPasswordScreen;
