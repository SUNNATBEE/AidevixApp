import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
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
};

const buildReviewPrompt = (html: string, css: string, js: string) =>
  `Men Aidevix Code Playground'ida HTML, CSS va JavaScript yozdim. Kodni professional ko'rib chiqdim deb, quyidagi formatda o'zbek tilida javob bering:\n\n## Xatolar\n(topilgan xato va muammolar, yo'q bo'lsa "Xato topilmadi")\n\n## Yaxshilash taklifi\n(3-5 ta konkret taklif)\n\n## Umumiy baho\nX/10 — (qisqacha izoh)\n\nHTML:\n\`\`\`html\n${html}\n\`\`\`\nCSS:\n\`\`\`css\n${css}\n\`\`\`\nJS:\n\`\`\`javascript\n${js}\n\`\`\``;

const AiCodeReviewModal = ({ visible, onClose, html, css, js }: Props) => {
  const { colors, spacing, radii } = useTheme();
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      fetchReview();
    } else {
      setReviewText('');
      setError('');
    }
  }, [visible]);

  const fetchReview = async () => {
    setLoading(true);
    setError('');
    setReviewText('');
    try {
      const prompt = buildReviewPrompt(html, css, js);
      const response = await axiosInstance.post('/ai/chat', {
        messages: [{ role: 'user', content: prompt }],
      });
      const text =
        response.data?.message ||
        response.data?.content ||
        response.data?.reply ||
        'Javob olinmadi';
      setReviewText(text);
    } catch {
      setError('Ko\'rib chiqishda xatolik yuz berdi. Qayta urinib ko\'ring.');
      triggerHaptic('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  const handleRetry = () => {
    triggerHaptic('medium');
    fetchReview();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '22' }]}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>AI Kod Ko'rib Chiqish</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Avtomatik kod tahlili
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Kod ko'rib chiqilmoqda...
              </Text>
              <Text style={[styles.loadingHint, { color: colors.textSecondary }]}>
                AI xatolar va taklif qidiryapti
              </Text>
            </View>
          )}

          {!loading && error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: colors.primary, borderRadius: radii.md }]}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.retryButtonText}>Qayta urinish</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && reviewText ? (
            <View style={[styles.reviewBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}>
              <Text style={[styles.reviewText, { color: colors.text }]}>{reviewText}</Text>
            </View>
          ) : null}
        </ScrollView>

        {!loading && (reviewText || error) && (
          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '55', borderRadius: radii.md }]}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={16} color={colors.primary} />
              <Text style={[styles.refreshButtonText, { color: colors.primary }]}>
                Qayta ko'rib chiqish
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginTop: 2 },
  closeBtn: { padding: 4 },
  content: { flexGrow: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: { fontSize: 16, fontWeight: '600' },
  loadingHint: { fontSize: 13 },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  errorText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  retryButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  reviewBox: {
    padding: 16,
    borderWidth: 1,
  },
  reviewText: { fontSize: 14, lineHeight: 22 },
  footer: { borderTopWidth: 1 },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
  },
  refreshButtonText: { fontWeight: '600', fontSize: 14 },
});

export default AiCodeReviewModal;
