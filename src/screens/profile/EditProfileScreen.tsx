import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../store/slices/authSlice';
import { triggerHaptic } from '../../utils/haptics';

// Native image picker yo'q — DiceBear orqali oldindan yaratilgan avatar to'plami.
// Foydalanuvchi shulardan bittasini tanlashi yoki o'zining URL'ini yopishtirishi mumkin.
const PRESET_AVATARS = [
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix1',
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix2',
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix3',
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix4',
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix5',
  'https://api.dicebear.com/9.x/avataaars/png?seed=Aidevix6',
  'https://api.dicebear.com/9.x/bottts/png?seed=Code1',
  'https://api.dicebear.com/9.x/bottts/png?seed=Code2',
];

const EditProfileScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const authError = useAppSelector((s) => s.auth.error);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [customUrl, setCustomUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const initial = (firstName?.[0] || lastName?.[0] || user?.email?.[0] || '?').toUpperCase();

  const dirty =
    firstName !== (user?.firstName ?? '') ||
    lastName !== (user?.lastName ?? '') ||
    avatar !== (user?.avatar ?? '');

  const pickPreset = (url: string) => {
    triggerHaptic('light');
    setAvatar(url);
  };

  const applyCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      Alert.alert(
        'Noto\'g\'ri URL',
        'URL http:// yoki https:// bilan boshlanishi kerak'
      );
      return;
    }
    triggerHaptic('success');
    setAvatar(trimmed);
    setCustomUrl('');
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert(
        'Ism majburiy',
        'Ismni kiriting'
      );
      return;
    }
    triggerHaptic('medium');
    setSaving(true);
    const result = await dispatch(
      updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar: avatar || undefined,
      } as any)
    );
    setSaving(false);
    if ((result as any).meta.requestStatus === 'fulfilled') {
      triggerHaptic('success');
      navigation.goBack();
    } else {
      triggerHaptic('error');
      Alert.alert(
        'Xatolik',
        (result as any).payload || authError || 'Saqlanmadi'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          hitSlop={10}
          style={[
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.xxl,
            fontWeight: typography.weights.bold,
            marginLeft: spacing.md,
            flex: 1,
          }}
        >
          Profilni tahrirlash
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!dirty || saving}
          style={[
            styles.saveBtn,
            {
              // Save vaqtida ham primary rangda turaman — spinner kontrasti uchun.
              // Faqat dirty=false bo'lganda kulrang (tugma o'chiq).
              backgroundColor: dirty ? colors.primary : colors.border,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                color: '#ffffff',
                fontWeight: typography.weights.bold,
                fontSize: typography.sizes.sm,
              }}
            >
              Saqlash
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatarPreview,
              { backgroundColor: colors.primary + '20', borderColor: colors.border },
            ]}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 56,
                  fontWeight: typography.weights.bold,
                }}
              >
                {initial}
              </Text>
            )}
          </View>
          {avatar ? (
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('warning');
                setAvatar('');
              }}
              style={{ marginTop: spacing.md }}
            >
              <Text
                style={{
                  color: colors.error,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.semibold,
                }}
              >
                Rasmni olib tashlash
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm },
          ]}
        >
          Tayyor avatarlar
        </Text>
        <View style={styles.presetGrid}>
          {PRESET_AVATARS.map((url) => {
            const selected = url === avatar;
            return (
              <Pressable
                key={url}
                onPress={() => pickPreset(url)}
                style={({ pressed }) => [
                  styles.presetWrap,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    borderWidth: selected ? 2 : 1,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Image source={{ uri: url }} style={styles.presetImg} />
                {selected && (
                  <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm },
          ]}
        >
          Yoki URL kiriting
        </Text>
        <View
          style={[
            styles.urlRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="link" size={18} color={colors.textSecondary} style={{ marginLeft: 12 }} />
          <TextInput
            value={customUrl}
            onChangeText={setCustomUrl}
            placeholder="https://..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              color: colors.text,
              paddingHorizontal: 10,
              paddingVertical: 12,
              fontSize: typography.sizes.md,
            }}
          />
          <TouchableOpacity
            onPress={applyCustomUrl}
            disabled={!customUrl.trim()}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              opacity: customUrl.trim() ? 1 : 0.4,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: typography.weights.bold,
                fontSize: typography.sizes.sm,
              }}
            >
              Qo'llash
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm },
          ]}
        >
          Shaxsiy ma'lumotlar
        </Text>

        <FieldLabel text="Ism" color={colors.textSecondary} />
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ismingiz"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
        />

        <FieldLabel text="Familiya" color={colors.textSecondary} />
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Familiyangiz"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
        />

        <FieldLabel text="Email" color={colors.textSecondary} />
        <View
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: 0.7,
              justifyContent: 'center',
            },
          ]}
        >
          <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
        </View>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.xs,
            marginTop: -4,
            marginBottom: 16,
          }}
        >
          Email o'zgartirib bo'lmaydi
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const FieldLabel = ({ text, color }: { text: string; color: string }) => (
  <Text
    style={{
      color,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 6,
      marginTop: 8,
    }}
  >
    {text}
  </Text>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    borderRadius: 10,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: { alignItems: 'center' },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  presetImg: { width: 60, height: 60, borderRadius: 30 },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 48,
  },
});

export default EditProfileScreen;
