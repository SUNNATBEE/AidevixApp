import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { shadow, useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendMessage, addMessage, clearChat, Message } from '../../store/slices/chatSlice';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '../../utils/haptics';

const SUGGESTIONS = [
  'React Native nima?',
  'useEffect qanday ishlaydi?',
  'Kodimda xato bor — yordam ber',
  'JavaScript va TypeScript farqi nima?',
];

const AIChatScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const dispatchSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    dispatch(addMessage(userMessage));
    dispatch(sendMessage(trimmed));
    setInput('');
    triggerHaptic('light');
  };

  const handleSend = () => dispatchSend(input);

  const handleSuggestion = (text: string) => {
    triggerHaptic('light');
    dispatchSend(text);
  };

  const handleClear = () => {
    Alert.alert('Suhbatni tozalash', 'Barcha xabarlar o\'chirilsinmi?', [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: 'Tozalash',
        style: 'destructive',
        onPress: () => {
          triggerHaptic('warning');
          dispatch(clearChat());
        },
      },
    ]);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(t);
  }, [messages, loading]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const isError = !!item.error;
    const bubbleBg = isUser
      ? colors.primary
      : isError
      ? colors.error + '20'
      : colors.card;
    const textColor = isUser ? '#ffffff' : isError ? colors.error : colors.text;
    const borderColor = isError ? colors.error : colors.border;
    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.userWrapper : styles.assistantWrapper,
          { marginBottom: spacing.md },
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.avatar,
              { backgroundColor: isError ? colors.error : colors.primary },
            ]}
          >
            <Ionicons
              name={isError ? 'alert' : 'sparkles'}
              size={16}
              color="#ffffff"
            />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: bubbleBg,
              borderColor,
              borderWidth: isUser ? 0 : 1,
              borderRadius: radii.lg,
              padding: spacing.md,
            },
            isUser ? styles.userBubble : styles.assistantBubble,
            !isUser && shadow('sm', colors.shadow),
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: textColor, fontSize: typography.sizes.md },
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  // Faqat welcome qoldi — foydalanuvchiga taklif chiplarini ko'rsatamiz.
  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: typography.sizes.lg },
            ]}
          >
            AICoach
          </Text>
          <Text
            style={[
              styles.headerStatus,
              { color: colors.success, fontSize: typography.sizes.xs },
            ]}
          >
            {loading ? 'Yozmoqda...' : 'Online'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClear} hitSlop={10}>
          <Ionicons name="trash-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {loading && (
              <View
                style={[
                  styles.typingContainer,
                  { padding: spacing.sm, marginBottom: spacing.sm },
                ]}
              >
                <ActivityIndicator size="small" color={colors.primary} />
                <Text
                  style={[
                    styles.typingText,
                    { color: colors.textSecondary, marginLeft: spacing.sm },
                  ]}
                >
                  AICoach o'ylamoqda...
                </Text>
              </View>
            )}
            {showSuggestions && (
              <View style={{ paddingTop: spacing.md }}>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.xs,
                    marginBottom: spacing.sm,
                    paddingHorizontal: spacing.xs,
                  }}
                >
                  Nimadan boshlaymiz?
                </Text>
                <View style={styles.suggestions}>
                  {SUGGESTIONS.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => handleSuggestion(s)}
                      style={({ pressed }) => [
                        styles.suggestionChip,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          borderRadius: radii.pill,
                          opacity: pressed ? 0.6 : 1,
                          paddingVertical: spacing.sm,
                          paddingHorizontal: spacing.md,
                          marginRight: spacing.sm,
                          marginBottom: spacing.sm,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: typography.sizes.sm,
                        }}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </>
        }
      />

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.muted,
              borderRadius: radii.xl,
              fontSize: typography.sizes.md,
            },
          ]}
          placeholder="Savol bering yoki kodni tashlang..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                input.trim() && !loading ? colors.primary : colors.border,
              marginLeft: spacing.sm,
            },
          ]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="send" size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: '700' },
  headerStatus: { marginTop: 2 },
  listContent: { flexGrow: 1 },
  messageWrapper: { flexDirection: 'row', maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end' },
  assistantWrapper: { alignSelf: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: { borderRadius: 16 },
  userBubble: { borderBottomRightRadius: 4 },
  assistantBubble: { borderBottomLeftRadius: 4 },
  messageText: { lineHeight: 22 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingContainer: { flexDirection: 'row', alignItems: 'center' },
  typingText: { fontSize: 12 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestionChip: { borderRadius: 999, borderWidth: 1 },
});

export default AIChatScreen;
