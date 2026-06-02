import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import VideoPlayerScreen from '../screens/courses/VideoPlayerScreen';
import { CourseStackParamList } from './types';

const Stack = createNativeStackNavigator<CourseStackParamList>();

const CoursesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
};

export default CoursesStack;
