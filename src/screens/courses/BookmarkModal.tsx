import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { Bookmark } from '../../store/slices/bookmarkSlice';

type Props = {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  courseId: string;
};

const storageKey = (videoId: string) => `@bookmarks_${videoId}`;

const BookmarkModal = ({ visible, onClose, videoId, courseId }: Props) => {
  const { colors, spacing, radii } = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) {
      loadBookmarks();
    }
  }, [visible]);

  const loadBookmarks = async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey(videoId));
      if (raw) setBookmarks(JSON.parse(raw));
      else setBookmarks([]);
    } catch {
      setBookmarks([]);
    }
  };

  const saveBookmarks = async (updated: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(storageKey(videoId), JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAdd = async () => {
    if (!note.trim()) return;
    triggerHaptic('success');
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      videoId,
      courseId,
      timestamp: 0, // real video player bo'lsa haqiqiy timestamp keladi
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    await saveBookmarks(updated);
    setNote('');
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    triggerHaptic('warning');
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    await saveBookmarks(updated);
  };

  const handleClose = () => {
    triggerHaptic('light');
    setShowForm(false);
    setNote('');
    onClose();
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
          <View style={[styles.iconBox, { backgroundColor: colors.accent + '22' }]}>
            <Ionicons name="bookmark" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>Belgilar</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {bookmarks.length} ta belgi
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {bookmarks.length === 0 && !showForm && (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Hali belgi yo'q
              </Text>
              <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
                Muhim joylarni belgilab qo'ying
              </Text>
            </View>
          )}

          {bookmarks.map((bm) => (
            <View
              key={bm.id}
              style={[styles.bookmarkItem, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.md }]}
            >
              <View style={[styles.timeBadge, { backgroundColor: colors.accent + '22', borderRadius: radii.sm }]}>
                <Ionicons name="time-outline" size={12} color={colors.accent} />
                <Text style={[styles.timeText, { color: colors.accent }]}>00:00</Text>
              </View>
              <Text style={[styles.noteText, { color: colors.text }]}>{bm.note}</Text>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {new Date(bm.createdAt).toLocaleDateString('uz-UZ')}
              </Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(bm.id)}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}

          {showForm && (
            <View
              style={[styles.formBox, { backgroundColor: colors.card, borderColor: colors.primary, borderRadius: radii.md }]}
            >
              <Text style={[styles.formLabel, { color: colors.text }]}>Eslatma</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.muted, color: colors.text, borderColor: colors.border, borderRadius: radii.sm }]}
                placeholder="Bu joyda nima muhim edi?"
                placeholderTextColor={colors.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                autoFocus
              />
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.border, borderRadius: radii.sm }]}
                  onPress={() => {
                    triggerHaptic('light');
                    setShowForm(false);
                    setNote('');
                  }}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Bekor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: colors.primary, borderRadius: radii.sm }]}
                  onPress={handleAdd}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveBtnText}>Saqlash</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent, borderRadius: radii.md }]}
            onPress={() => {
              triggerHaptic('medium');
              setShowForm(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Yangi belgi qo'shish</Text>
          </TouchableOpacity>
        </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptyHint: { fontSize: 13 },
  bookmarkItem: {
    padding: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 8,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timeText: { fontSize: 11, fontWeight: '700' },
  noteText: { fontSize: 14, lineHeight: 20 },
  dateText: { fontSize: 11 },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  formBox: {
    padding: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 8,
  },
  formLabel: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  cancelBtnText: { fontWeight: '600', fontSize: 14 },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  footer: { borderTopWidth: 1 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default BookmarkModal;
