import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { Course } from '../../types/course';
import Card from '../common/Card';

interface CourseCardProps {
  course: Course;
  onPress: (id: string) => void;
  horizontal?: boolean;
}

const CourseCard = ({ course, onPress, horizontal = false }: CourseCardProps) => {
  const { colors, spacing } = useTheme();

  return (
    <Card
      noPadding
      onPress={() => onPress(course._id)}
      style={{
        width: horizontal ? 280 : '100%',
        marginRight: horizontal ? spacing.md : 0,
        marginBottom: horizontal ? 0 : spacing.md,
      }}
    >
      <Image
        source={{ uri: course.thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]}>{course.category.toUpperCase()}</Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {course.title}
        </Text>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {course.rating || 0} ({course.ratingCount || 0})
            </Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>
            {course.isFree ? 'Bepul' : `${course.price.toLocaleString()} UZS`}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
