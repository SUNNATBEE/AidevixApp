import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: route.params?.email || '' }
  });

  const onSubmit = (data: any) => {
    // Send code logic
    console.log(data);
    navigation.navigate('ResetPassword', { email: data.email });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 }}>
      <Text style={[styles.title, { color: colors.text }]}>Parolni tiklash</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Email manzilingizni kiriting, biz sizga tasdiqlash kodini yuboramiz.
      </Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email kiriting' }}
        render={({ field: { onChange, value } }) => (
          <Input 
            label="Email" 
            placeholder="mail@example.com" 
            onChangeText={onChange} 
            value={value} 
            error={errors.email?.message} 
            keyboardType="email-address" 
          />
        )}
      />

      <Button title="Kodni yuborish" onPress={handleSubmit(onSubmit)} style={styles.button} />
      <Button title="Orqaga" onPress={() => navigation.goBack()} variant="ghost" />
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
    marginBottom: 12,
  },
});

export default ForgotPasswordScreen;
