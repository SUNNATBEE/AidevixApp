import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { xpApi } from '../../api/xpApi';
import { courseApi } from '../../api/courseApi';
import { useAppDispatch } from '../../store/hooks';
import { updateUserLocal } from '../../store/slices/authSlice';
import XPToast from '../common/XPToast';
import { Quiz, QuizAnswer, QuizFetch, QuizSubmitResult } from '../../types/quiz';
import { Video } from '../../types/course';

type Props = {
  visible: boolean;
  onClose: () => void;
  // Berilsa — shu videoning testi. Berilmasa — birinchi mavjud testни qidiramiz.
  videoId?: string;
};

type Status = 'loading' | 'empty' | 'error' | 'solved' | 'taking' | 'result';

// Backend ba'zan {data:{...}}, ba'zan to'g'ridan-to'g'ri obyekt qaytaradi.
const unwrap = (d: any): any => d?.data ?? d;

const QuizModal: React.FC<Props> = ({ visible, onClose, videoId }) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<Status>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  // answers[questionIndex] = tanlangan variant indeksi (yoki undefined)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [showXP, setShowXP] = useState(false);

  // Birinchi mavjud testni topish: berilgan videoId yoki top-kurs videolari probe.
  const resolveQuiz = useCallback(async (): Promise<QuizFetch | null> => {
    if (videoId) {
      const r = await xpApi.getQuizForVideo(videoId);
      return unwrap(r.data) ?? null;
    }
    const top = await courseApi.getTopCourses();
    const courses: { _id: string }[] = unwrap(top.data) ?? [];
    for (const c of courses.slice(0, 2)) {
      const detail = await courseApi.getCourseById(c._id);
      const data = unwrap(detail.data);
      const videos: Video[] =
        data?.videos ?? (data?.sections?.flatMap((s: any) => s.videos) ?? []);
      for (const v of videos.slice(0, 20)) {
        const qr = await xpApi.getQuizForVideo(v._id);
        const qd = unwrap(qr.data);
        if (qd?.quiz) return qd;
      }
    }
    return null;
  }, [videoId]);

  const load = useCallback(async () => {
    setStatus('loading');
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setPreviousScore(null);
    try {
      const fetched = await resolveQuiz();
      if (!fetched?.quiz) {
        setStatus('empty');
        return;
      }
      setQuiz(fetched.quiz);
      if (fetched.alreadySolved) {
        setPreviousScore(fetched.previousScore);
        setStatus('solved');
      } else {
        setStatus('taking');
      }
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || e?.message || 'Testni yuklab bo\'lmadi');
      setStatus('error');
    }
  }, [resolveQuiz]);

  useEffect(() => {
    if (visible) load();
  }, [visible, load]);

  const selectOption = (qIndex: number, optIndex: number) => {
    triggerHaptic('light');
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const allAnswered = !!quiz && quiz.questions.every((_, i) => answers[i] !== undefined);

  const handleSubmit = async () => {
    if (!quiz || !allAnswered || submitting) return;
    setSubmitting(true);
    triggerHaptic('medium');
    const payload: QuizAnswer[] = quiz.questions.map((_, i) => ({
      questionIndex: i,
      selectedOption: answers[i],
    }));
    try {
      const r = await xpApi.submitQuiz(quiz._id, payload);
      const data: QuizSubmitResult = unwrap(r.data);
      setResult(data);
      setStatus('result');
      if (data.passed) {
        setShowXP(true);
        triggerHaptic('success');
      } else {
        triggerHaptic('error');
      }
      // Home/profil XP'sini darhol yangilaymiz.
      if (typeof data.totalXp === 'number') {
        dispatch(updateUserLocal({ xp: data.totalXp }));
      }
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || e?.message || 'Topshirishda xatolik');
      setStatus('error');
      triggerHaptic('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.avatarBox, { backgroundColor: colors.primary + '22' }]}>
            <Ionicons name="checkmark-done" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {quiz?.title || 'Test'}
            </Text>
            {status === 'taking' && quiz && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {quiz.questions.length} ta savol • {"o'tish"} {quiz.passingScore}%
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.headerIcon}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {status === 'loading' && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.muted, { color: colors.textSecondary }]}>Test yuklanmoqda...</Text>
          </View>
        )}

        {/* Empty */}
        {status === 'empty' && (
          <View style={styles.centered}>
            <Ionicons name="documents-outline" size={56} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{"Hozircha test yo'q"}</Text>
            <Text style={[styles.muted, { color: colors.textSecondary, textAlign: 'center' }]}>
              {"Tez orada darslar uchun testlar qo'shiladi."}
            </Text>
          </View>
        )}

        {/* Error */}
        {status === 'error' && (
          <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={56} color={colors.error} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Xatolik</Text>
            <Text style={[styles.muted, { color: colors.textSecondary, textAlign: 'center' }]}>{errorMsg}</Text>
            <TouchableOpacity
              onPress={load}
              style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: radii.lg, marginTop: spacing.lg }]}
            >
              <Text style={styles.primaryBtnText}>Qayta urinish</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Already solved */}
        {status === 'solved' && (
          <View style={styles.centered}>
            <Ionicons name="ribbon-outline" size={56} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Allaqachon yechilgan</Text>
            <Text style={[styles.muted, { color: colors.textSecondary }]}>
              Natijangiz: {previousScore ?? 0}%
            </Text>
            <Text style={[styles.muted, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
              Har testни faqat bir marta yechish mumkin.
            </Text>
          </View>
        )}

        {/* Taking quiz */}
        {status === 'taking' && quiz && (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              {quiz.questions.map((q, qi) => (
                <View
                  key={q._id || qi}
                  style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg }]}
                >
                  <Text style={[styles.questionText, { color: colors.text }]}>
                    {qi + 1}. {q.question}
                  </Text>
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    return (
                      <TouchableOpacity
                        key={oi}
                        activeOpacity={0.7}
                        onPress={() => selectOption(qi, oi)}
                        style={[
                          styles.option,
                          {
                            borderColor: selected ? colors.primary : colors.border,
                            backgroundColor: selected ? colors.primary + '18' : 'transparent',
                            borderRadius: radii.md,
                          },
                        ]}
                      >
                        <Ionicons
                          name={selected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={selected ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!allAnswered || submitting}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: allAnswered && !submitting ? colors.primary : colors.border, borderRadius: radii.lg },
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    {allAnswered ? 'Topshirish' : `Javob bering (${Object.keys(answers).length}/${quiz.questions.length})`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Result */}
        {status === 'result' && result && quiz && (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={[styles.resultHero, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.xl }]}>
              <Ionicons
                name={result.passed ? 'trophy' : 'close-circle'}
                size={64}
                color={result.passed ? colors.accent : colors.error}
              />
              <Text style={[styles.resultScore, { color: colors.text }]}>{result.score}%</Text>
              <Text style={[styles.resultLabel, { color: result.passed ? colors.success : colors.error }]}>
                {result.passed ? 'O\'tdingiz! 🎉' : 'O\'tmadingiz'}
              </Text>
              <Text style={[styles.muted, { color: colors.textSecondary }]}>
                {result.correctCount}/{result.totalQuestions} {"to'g'ri"} • +{result.xpEarned} XP
              </Text>
            </View>

            {/* Har savol bo'yicha to'g'ri/noto'g'ri (backend to'g'ri variantni bermaydi) */}
            {quiz.questions.map((q, qi) => {
              const a = result.answers.find((x) => x.questionIndex === qi);
              const correct = a?.isCorrect;
              return (
                <View
                  key={q._id || qi}
                  style={[styles.reviewRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.md }]}
                >
                  <Ionicons
                    name={correct ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={correct ? colors.success : colors.error}
                  />
                  <Text style={[styles.reviewText, { color: colors.text }]} numberOfLines={2}>
                    {qi + 1}. {q.question}
                  </Text>
                </View>
              );
            })}

            <TouchableOpacity
              onPress={onClose}
              style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: radii.lg, marginTop: spacing.lg }]}
            >
              <Text style={styles.primaryBtnText}>Yopish</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* XP animatsiyasi (o'tganda) */}
        {showXP && result && (
          <View style={styles.xpAnchor} pointerEvents="none">
            <XPToast xp={result.xpEarned} onDone={() => setShowXP(false)} />
          </View>
        )}
      </View>
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
    gap: 10,
    borderBottomWidth: 1,
  },
  avatarBox: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginTop: 2 },
  headerIcon: { padding: 6 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  muted: { fontSize: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },

  content: { padding: 16, gap: 14, paddingBottom: 32 },

  questionCard: { padding: 16, borderWidth: 1, gap: 10 },
  questionText: { fontSize: 16, fontWeight: '600', lineHeight: 22, marginBottom: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderWidth: 1,
  },
  optionText: { fontSize: 15, flex: 1 },

  footer: { padding: 16, borderTopWidth: 1 },
  primaryBtn: { paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  resultHero: { alignItems: 'center', gap: 6, padding: 24, borderWidth: 1 },
  resultScore: { fontSize: 44, fontWeight: '900', marginTop: 8 },
  resultLabel: { fontSize: 18, fontWeight: '700' },

  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1 },
  reviewText: { fontSize: 14, flex: 1 },

  xpAnchor: { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center' },
});

export default QuizModal;
