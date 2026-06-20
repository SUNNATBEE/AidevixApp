import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchSubscriptionStatus,
    verifyInstagramSubscription,
    verifyTelegramSubscription,
} from '../../store/slices/subscriptionSlice';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

const TELEGRAM_URL = 'https://t.me/aidevix';
const INSTAGRAM_URL = 'https://instagram.com/aidevix.uz';

const SubscriptionScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { status, loading, verifying, error } = useAppSelector((s) => s.subscription);

  const [tgUsername, setTgUsername] = useState('');
  const [igUsername, setIgUsername] = useState('');

  const load = useCallback(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const tgVerified = status?.telegram?.subscribed ?? false;
  const igVerified = status?.instagram?.subscribed ?? false;
  const hasFullAccess = status?.hasFullAccess ?? false;

  const handleVerifyTelegram = async () => {
    const username = tgUsername.trim().replace('@', '');
    if (!username) {
      Alert.alert('Username kiriting', 'Telegram username\'ingizni kiriting');
      return;
    }
    triggerHaptic('medium');
    const result = await dispatch(verifyTelegramSubscription(username));
    if ((result as any).meta.requestStatus === 'fulfilled') {
      triggerHaptic('success');
      setTgUsername('');
      Alert.alert('Tasdiqlandi', 'Telegram obunangiz tasdiqlandi!');
    } else {
      triggerHaptic('error');
      Alert.alert('Xatolik', (result as any).payload || 'Obunani tasdiqlab bo\'lmadi');
    }
  };

  const handleVerifyInstagram = async () => {
    const username = igUsername.trim().replace('@', '');
    if (!username) {
      Alert.alert('Username kiriting', 'Instagram username\'ingizni kiriting');
      return;
    }
    triggerHaptic('medium');
    const result = await dispatch(verifyInstagramSubscription(username));
    if ((result as any).meta.requestStatus === 'fulfilled') {
      triggerHaptic('success');
      setIgUsername('');
      Alert.alert('Tasdiqlandi', 'Instagram obunangiz tasdiqlandi!');
    } else {
      triggerHaptic('error');
      Alert.alert('Xatolik', (result as any).payload || 'Obunani tasdiqlab bo\'lmadi');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 80, paddingBottom: spacing.huge }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xxxl ?? 28 }]}>
          Obuna bo'lish
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Videolarni ko'rish uchun Telegram va Instagram kanallarimizga obuna bo'lishingiz kerak.
        </Text>

        {/* Full access banner */}
        {hasFullAccess ? (
          <View
            style={[
              styles.successBanner,
              { backgroundColor: colors.success + '20', borderColor: colors.success, borderRadius: radii.lg, padding: spacing.lg },
            ]}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              To'liq kirish huquqi mavjud
            </Text>
          </View>
        ) : null}

        {/* Telegram */}
        <View
          style={[
            styles.step,
            {
              backgroundColor: colors.card,
              borderColor: tgVerified ? colors.success : colors.border,
              borderRadius: radii.lg,
              padding: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={styles.stepHeader}>
            {/* logo-telegram runtime'da mavjud, lekin bu @expo/vector-icons versiyasining
                tip unionida yo'q — shuning uchun nuqtali kast */}
            <Ionicons name={'logo-telegram' as keyof typeof Ionicons.glyphMap} size={32} color="#0088cc" />
            <View style={styles.stepTitleRow}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>1-qadam: Telegram</Text>
              {tgVerified ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              ) : null}
            </View>
          </View>

          {!tgVerified ? (
            <>
              <TouchableOpacity
                style={[styles.openBtn, { backgroundColor: '#0088cc', borderRadius: radii.md, marginTop: spacing.md }]}
                onPress={() => {
                  triggerHaptic('light');
                  Linking.openURL(TELEGRAM_URL);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="open-outline" size={16} color="#ffffff" />
                <Text style={styles.openBtnText}>Kanalga qo'shilish</Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.inputLabel,
                  { color: colors.textSecondary, marginTop: spacing.md },
                ]}
              >
                Obuna bo'lgach, username'ingizni kiriting:
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: radii.md },
                ]}
              >
                <Text style={[styles.atSign, { color: colors.textSecondary }]}>@</Text>
                <TextInput
                  value={tgUsername}
                  onChangeText={setTgUsername}
                  placeholder="username"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.verifyBtn,
                  {
                    backgroundColor: tgUsername.trim() ? colors.primary : colors.border,
                    borderRadius: radii.md,
                    marginTop: spacing.sm,
                  },
                ]}
                onPress={handleVerifyTelegram}
                disabled={verifying || !tgUsername.trim()}
                activeOpacity={0.85}
              >
                {verifying ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.verifyBtnText}>Tasdiqlash</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.verifiedText, { color: colors.success, marginTop: spacing.sm }]}>
              ✓ Tasdiqlangan: @{status?.telegram?.username}
            </Text>
          )}
        </View>

        {/* Instagram */}
        <View
          style={[
            styles.step,
            {
              backgroundColor: colors.card,
              borderColor: igVerified ? colors.success : colors.border,
              borderRadius: radii.lg,
              padding: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={styles.stepHeader}>
            <Ionicons name="logo-instagram" size={32} color="#e1306c" />
            <View style={styles.stepTitleRow}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>2-qadam: Instagram</Text>
              {igVerified ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              ) : null}
            </View>
          </View>

          {!igVerified ? (
            <>
              <TouchableOpacity
                style={[styles.openBtn, { backgroundColor: '#e1306c', borderRadius: radii.md, marginTop: spacing.md }]}
                onPress={() => {
                  triggerHaptic('light');
                  Linking.openURL(INSTAGRAM_URL);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="open-outline" size={16} color="#ffffff" />
                <Text style={styles.openBtnText}>Obuna bo'lish</Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.inputLabel,
                  { color: colors.textSecondary, marginTop: spacing.md },
                ]}
              >
                Obuna bo'lgach, username'ingizni kiriting:
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: radii.md },
                ]}
              >
                <Text style={[styles.atSign, { color: colors.textSecondary }]}>@</Text>
                <TextInput
                  value={igUsername}
                  onChangeText={setIgUsername}
                  placeholder="username"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.verifyBtn,
                  {
                    backgroundColor: igUsername.trim() ? colors.primary : colors.border,
                    borderRadius: radii.md,
                    marginTop: spacing.sm,
                  },
                ]}
                onPress={handleVerifyInstagram}
                disabled={verifying || !igUsername.trim()}
                activeOpacity={0.85}
              >
                {verifying ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.verifyBtnText}>Tasdiqlash</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.verifiedText, { color: colors.success, marginTop: spacing.sm }]}>
              ✓ Tasdiqlangan: @{status?.instagram?.username}
            </Text>
          )}
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  successText: { fontSize: 15, fontWeight: '700' },
  step: { borderRadius: 16, borderWidth: 1 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepTitle: { fontSize: 17, fontWeight: '600' },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
  },
  openBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  inputLabel: { fontSize: 13 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
    paddingHorizontal: 10,
  },
  atSign: { fontSize: 16, fontWeight: '600' },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, fontSize: 15 },
  verifyBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  verifyBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  verifiedText: { fontSize: 14, fontWeight: '600' },
  errorText: { textAlign: 'center', fontSize: 13, marginTop: 8 },
});

export default SubscriptionScreen;
