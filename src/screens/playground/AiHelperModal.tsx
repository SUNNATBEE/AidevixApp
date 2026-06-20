import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import axiosInstance from '../../api/axiosInstance';

type Props = {
  visible: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  activeLanguage: 'html' | 'css' | 'js' | 'output';
};

type AiMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  error?: boolean;
};

type QuickAction = { id: string; icon: keyof typeof Ionicons.glyphMap; label: string; prompt: string };

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'explain', icon: 'help-circle-outline', label: 'Tushuntir', prompt: 'Mening kodlarimni o\'zbek tilida sodda til bilan tushuntirib bering. Har bir til (HTML, CSS, JS) nima qilayotganini ayting.' },
  { id: 'fix', icon: 'bug-outline', label: 'Xato top', prompt: 'Kodlarimda xatoliklar yoki muammolar bormi? Topgan xatolaringizni o\'zbek tilida tushuntirib, qanday tuzatish kerakligini ko\'rsating.' },
  { id: 'improve', icon: 'sparkles-outline', label: 'Yaxshilang', prompt: 'Mening kodimni qanday yaxshilash mumkin? Optimallashtirish, o\'qish oson bo\'lishi, zamonaviyroq qilish bo\'yicha maslahatlar bering.' },
  { id: 'comment', icon: 'chatbox-outline', label: 'Komment', prompt: 'Kodlarimga foydali sharhlar (komment) qo\'shib qaytaring. O\'zbek tilida, har bir muhim qatorga.' },
  { id: 'next', icon: 'arrow-forward-outline', label: 'Keyingi qadam', prompt: 'Mening kodimga qanday yangi xususiyat qo\'shsam bo\'ladi? Boshlang\'ich sevuvchi o\'quvchi uchun mos taklif bering.' },
];

const SYSTEM_INTRO = 'Salom! Men sizning AI yordamchingizman. Kodingiz haqida savol bering yoki pastdagi tezkor tugmalardan birini bosing.';

const buildContextMessage = (html: string, css: string, js: string, question: string) => {
  return `Men Aidevix mobil ilovasining Code Playground oynasida HTML, CSS va JS o'rganmoqdaman.\n\nJoriy kodlarim:\n\nHTML:\n\`\`\`html\n${html}\n\`\`\`\n\nCSS:\n\`\`\`css\n${css}\n\`\`\`\n\nJavaScript:\n\`\`\`javascript\n${js}\n\`\`\`\n\nSavolim: ${question}\n\nIltimos, javobni o'zbek tilida, sodda va aniq bering. Kod misol kerak bo'lsa, code block ichida yozing.`;
};

const AiHelperModal: React.FC<Props> = ({ visible, onClose, html, css, js, activeLanguage }) => {
  const { colors, spacing } = useTheme();
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 'intro', role: 'system', content: SYSTEM_INTRO },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Yangi xabar kelganda pastga sudrash
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [messages, loading]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;

    const userMsg: AiMessage = { id: Date.now().toString(), role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    triggerHaptic('light');
    setLoading(true);

    try {
      const fullMessage = buildContextMessage(html, css, js, q);
      const resp = await axiosInstance.post('/ai/chat', { message: fullMessage }, { timeout: 60000 });
      const reply = resp.data?.reply ?? resp.data?.message ?? resp.data?.data?.reply ?? 'Javob kelmadi';
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '-r', role: 'assistant', content: String(reply) },
      ]);
      triggerHaptic('success');
    } catch (e: any) {
      const errMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (e?.code === 'ECONNABORTED' ? 'Aloqa juda sekin (timeout)' : null) ||
        e?.message ||
        'Aloqa muammosi';
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '-e', role: 'assistant', content: 'Xatolik: ' + errMsg, error: true },
      ]);
      triggerHaptic('error');
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    triggerHaptic('warning');
    setMessages([{ id: 'intro', role: 'system', content: SYSTEM_INTRO }]);
  };

  const langLabel =
    activeLanguage === 'html' ? 'HTML' : activeLanguage === 'css' ? 'CSS' : activeLanguage === 'js' ? 'JS' : 'NATIJA';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={[styles.avatarBox, { backgroundColor: colors.primary + '22' }]}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>AI Yordam</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {langLabel} kontekstida — kodingiz haqida savol bering
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClear} style={styles.headerIcon}>
            <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.headerIcon}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => {
            if (m.role === 'system') {
              return (
                <View key={m.id} style={[styles.systemBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
                  <Text style={[styles.systemText, { color: colors.textSecondary }]}>{m.content}</Text>
                </View>
              );
            }
            const isUser = m.role === 'user';
            return (
              <View
                key={m.id}
                style={[
                  styles.bubble,
                  isUser
                    ? { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 }
                    : {
                        backgroundColor: m.error ? colors.error + '22' : colors.card,
                        borderColor: m.error ? colors.error : colors.border,
                        borderWidth: 1,
                        alignSelf: 'flex-start',
                        borderBottomLeftRadius: 4,
                      },
                ]}
              >
                {!isUser && (
                  <View style={styles.assistantHeader}>
                    <Ionicons name="sparkles" size={12} color={m.error ? colors.error : colors.primary} />
                    <Text style={[styles.assistantLabel, { color: m.error ? colors.error : colors.primary }]}>
                      {m.error ? 'Xatolik' : 'AI yordam'}
                    </Text>
                  </View>
                )}
                <Text style={[styles.bubbleText, { color: isUser ? '#fff' : colors.text }]}>{m.content}</Text>
              </View>
            );
          })}

          {loading && (
            <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, alignSelf: 'flex-start' }]}>
              <View style={styles.assistantHeader}>
                <Ionicons name="sparkles" size={12} color={colors.primary} />
                <Text style={[styles.assistantLabel, { color: colors.primary }]}>AI yordam</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.bubbleText, { color: colors.textSecondary, fontStyle: 'italic' }]}>O'ylamoqda...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.actionsRow}
          contentContainerStyle={styles.actionsContent}
        >
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => send(a.prompt)}
              disabled={loading}
              style={[
                styles.actionChip,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: loading ? 0.5 : 1 },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name={a.icon} size={14} color={colors.primary} />
              <Text style={[styles.actionChipText, { color: colors.text }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.muted }]}
            value={input}
            onChangeText={setInput}
            placeholder="Savolingizni shu yerga yozing..."
            placeholderTextColor={colors.textSecondary}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim() || loading}
            style={[
              styles.sendButton,
              { backgroundColor: input.trim() && !loading ? colors.primary : colors.border },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 17, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginTop: 2 },
  headerIcon: { padding: 6 },

  messagesScroll: { flex: 1 },
  messagesContent: { padding: 14, gap: 10 },

  systemBubble: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  systemText: { fontSize: 13, flex: 1, lineHeight: 18 },

  bubble: {
    maxWidth: '90%',
    padding: 12,
    borderRadius: 16,
    gap: 6,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assistantLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bubbleText: { fontSize: 14, lineHeight: 20 },

  actionsRow: { maxHeight: 50, flexGrow: 0 },
  actionsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  actionChipText: { fontSize: 13, fontWeight: '600' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AiHelperModal;
