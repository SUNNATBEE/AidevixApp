import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CodePlaygroundScreen from '../screens/playground/CodePlaygroundScreen';
import ShortsScreen from '../screens/shorts/ShortsScreen';
import FoundersScreen from '../screens/founders/FoundersScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Playground" component={CodePlaygroundScreen} />
      <Stack.Screen name="Shorts" component={ShortsScreen} />
      <Stack.Screen name="Founders" component={FoundersScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
