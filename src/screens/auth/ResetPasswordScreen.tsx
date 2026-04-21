import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: route.params?.email || '', code: '', newPassword: '' }
  });

  const onSubmit = (data: any) => {
    // Reset password logic
    console.log(data);
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 }}>
      <Text style={[styles.title, { color: colors.text }]}>Yangi parol</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Sizga yuborilgan kodni va yangi parolni kiriting.
      </Text>

      <Controller
        control={control}
        name="code"
        rules={{ required: 'Kodni kiriting' }}
        render={({ field: { onChange, value } }) => (
          <Input label="Tasdiqlash kodi" placeholder="123456" onChangeText={onChange} value={value} error={errors.code?.message} keyboardType="number-pad" />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        rules={{ required: 'Yangi parol kiriting', minLength: { value: 6, message: 'Kamida 6ta belgi' } }}
        render={({ field: { onChange, value } }) => (
          <Input label="Yangi parol" placeholder="********" onChangeText={onChange} value={value} error={errors.newPassword?.message} secureTextEntry />
        )}
      />

      <Button title="Saqlash" onPress={handleSubmit(onSubmit)} style={styles.button} />
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
    marginTop: 16,
  },
});

export default ResetPasswordScreen;
