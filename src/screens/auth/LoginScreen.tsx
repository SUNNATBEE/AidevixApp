import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

const LoginScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data: any) => {
    dispatch(login(data));
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Xush kelibsiz!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Aidevix — AI bilan dasturlashni o'rganing
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email kiriting' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="misol@mail.uz"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Parol kiriting' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Parol"
                placeholder="********"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword', { email: '' })}
            style={styles.forgotPass}
          >
            <Text style={{ color: colors.primary }}>Parolni unutdingizumi?</Text>
          </TouchableOpacity>

          {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

          <Button 
            title="Kirish" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={{ color: colors.textSecondary }}>Hali ro'yxatdan o'tmaganmisiz? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ro'yxatdan o'tish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
});

export default LoginScreen;
