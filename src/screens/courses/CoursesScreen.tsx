import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useTheme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/courseSlice';
import CourseCard from '../../components/course/CourseCard';
import Loader from '../../components/common/Loader';
import { Ionicons } from '@expo/vector-icons';

const CoursesScreen = ({ navigation }: any) => {
  const { colors, spacing } = useTheme();
  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector((state) => state.course);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ search }));
  }, [dispatch, search]);

  const renderItem = ({ item }: any) => (
    <CourseCard 
      course={item} 
      onPress={(id) => navigation.navigate('CourseDetail', { courseId: id })} 
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { padding: spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Kurslar</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Kurslarni qidirish..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && courses.length === 0 ? (
        <Loader fullScreen />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
  },
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
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default CoursesScreen;
