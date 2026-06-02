import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { MainTabParamList } from './types';
import HomeStack from './HomeStack';
import CoursesStack from './CoursesStack';
import ProfileStack from './ProfileStack';
import PromptsScreen from '../screens/prompts/PromptsScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import AIChatScreen from '../screens/ai/AIChatScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeStack') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'CoursesStack') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'AIChat') iconName = focused ? 'sparkles' : 'sparkles-outline';
          else if (route.name === 'PromptsStack') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Leaderboard') iconName = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'ProfileStack') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 65,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{ title: 'Asosiy' }} 
      />
      <Tab.Screen
        name="CoursesStack"
        component={CoursesStack}
        options={{ title: 'Kurslar' }}
      />
      <Tab.Screen 
        name="AIChat" 
        component={AIChatScreen} 
        options={{ title: 'AICoach' }} 
      />
      <Tab.Screen 
        name="PromptsStack" 
        component={PromptsScreen} 
        options={{ title: 'Promptlar' }} 
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen} 
        options={{ title: 'Reyting' }} 
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
