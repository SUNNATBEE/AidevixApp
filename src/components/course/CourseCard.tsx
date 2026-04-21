import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Course } from '../../types/course';

interface CourseCardProps {
  course: Course;
  onPress: (id: string) => void;
  horizontal?: boolean;
}

const CourseCard = ({ course, onPress, horizontal = false }: CourseCardProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          width: horizontal ? 280 : '48%',
          marginRight: horizontal ? spacing.md : 0,
          marginBottom: horizontal ? 0 : spacing.md
        }
      ]}
      onPress={() => onPress(course._id)}
    >
      <Image
        source={{ uri: course.thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]}>{course.category.toUpperCase()}</Text>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={2}
        >
          {course.title}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#ffd700" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {course.rating || 0} ({course.ratingCount || 0})
            </Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>
            {course.isFree ? 'Bepul' : `${course.price.toLocaleString()} UZS`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CourseCard;
