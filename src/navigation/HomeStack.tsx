import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import FocusModeScreen from '../screens/focus/FocusModeScreen';
import CodePlaygroundScreen from '../screens/playground/CodePlaygroundScreen';
import ShortsScreen from '../screens/shorts/ShortsScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FocusMode" component={FocusModeScreen} />
      <Stack.Screen name="Playground" component={CodePlaygroundScreen} />
      <Stack.Screen name="Shorts" component={ShortsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
