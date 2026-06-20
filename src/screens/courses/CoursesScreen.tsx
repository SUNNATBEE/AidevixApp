import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/courseSlice';
import CourseCard from '../../components/course/CourseCard';
import FadeInView from '../../components/common/FadeInView';
import Loader from '../../components/common/Loader';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../../utils/constants';
import { triggerHaptic } from '../../utils/haptics';

const CATEGORY_LABELS: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  react: 'React',
  typescript: 'TypeScript',
  nodejs: 'Node.js',
  general: 'Umumiy',
  ai: 'AI',
  telegram: 'Telegram',
  security: 'Xavfsizlik',
  career: 'Karyera',
  nocode: 'No-Code',
  web3: 'Web3',
};

const ALL_CATEGORY = 'all';

const CoursesScreen = ({ navigation }: any) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector((state) => state.course);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const params: { search?: string; category?: string } = {};
    if (search) params.search = search;
    if (category !== ALL_CATEGORY) params.category = category;
    dispatch(fetchCourses(params));
  }, [dispatch, search, category]);

  const selectedLabel =
    category === ALL_CATEGORY ? 'Hammasi' : CATEGORY_LABELS[category] ?? category;

  const openModal = () => {
    triggerHaptic('light');
    setModalVisible(true);
  };

  const selectCategory = (value: string) => {
    triggerHaptic('light');
    setCategory(value);
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: any) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(14)}
      style={{ width: '48%' }}
    >
      <CourseCard
        course={item}
        onPress={(id) => navigation.navigate('CourseDetail', { courseId: id })}
      />
    </Animated.View>
  );

  const renderCategoryRow = (value: string, label: string) => {
    const isSelected = value === category;
    return (
      <TouchableOpacity
        key={value}
        onPress={() => selectCategory(value)}
        style={[
          styles.modalRow,
          {
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            backgroundColor: isSelected ? colors.primarySoft : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            styles.modalRowText,
            {
              color: isSelected ? colors.primary : colors.text,
              fontWeight: isSelected ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
        {isSelected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <FadeInView style={[styles.header, { padding: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Kurslar</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: radii.md }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Kurslarni qidirish..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          onPress={openModal}
          activeOpacity={0.7}
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radii.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Ionicons name="filter" size={18} color={colors.textSecondary} />
          <Text style={[styles.dropdownLabel, { color: colors.textSecondary }]}>
            Kategoriya:
          </Text>
          <Text style={[styles.dropdownValue, { color: colors.text }]}>
            {selectedLabel}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </FadeInView>

      {loading && courses.length === 0 ? (
        <Loader fullScreen />
      ) : courses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={56} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Ushbu kategoriyada kurs topilmadi
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.card,
                paddingBottom: spacing.xxl,
                borderTopLeftRadius: radii.xl,
                borderTopRightRadius: radii.xl,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle}>
              <View style={[styles.modalHandleBar, { backgroundColor: colors.border }]} />
            </View>
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
              ]}
            >
              Kategoriya tanlang
            </Text>
            <FlatList
              data={[ALL_CATEGORY, ...CATEGORIES]}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCategoryRow(
                  item,
                  item === ALL_CATEGORY ? 'Hammasi' : CATEGORY_LABELS[item] ?? item,
                )
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dropdownLabel: {
    fontSize: 14,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 12,
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalRowText: {
    fontSize: 16,
  },
});

export default CoursesScreen;
