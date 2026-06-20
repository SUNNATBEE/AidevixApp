import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { shadow, useTheme } from '../theme';
import AIChatScreen from '../screens/ai/AIChatScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import CoursesStack from './CoursesStack';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Fokuslanganda bounce + tint pill animatsiyasi
const AnimatedTabIcon = ({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) => {
  const { colors, radii } = useTheme();
  const scale = useSharedValue(focused ? 1 : 0.9);
  const pill = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 0.9, { damping: 12, stiffness: 220 });
    pill.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pillStyle = useAnimatedStyle(() => ({
    opacity: pill.value,
    transform: [{ scaleX: 0.6 + pill.value * 0.4 }],
  }));

  return (
    <View style={styles.iconWrap}>
      <Animated.View
        style={[
          styles.pill,
          { backgroundColor: colors.primarySoft, borderRadius: radii.pill },
          pillStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons name={name} size={24} color={color} />
      </Animated.View>
    </View>
  );
};

const icons: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  HomeStack: ['home', 'home-outline'],
  CoursesStack: ['book', 'book-outline'],
  AIChat: ['sparkles', 'sparkles-outline'],
  Leaderboard: ['trophy', 'trophy-outline'],
  ProfileStack: ['person', 'person-outline'],
};

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = icons[route.name] ?? ['home', 'home-outline'];
          return <AnimatedTabIcon name={focused ? active : inactive} focused={focused} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          shadow('lg', colors.shadow),
        ],
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Asosiy' }} />
      <Tab.Screen name="CoursesStack" component={CoursesStack} options={{ title: 'Kurslar' }} />
      <Tab.Screen name="AIChat" component={AIChatScreen} options={{ title: 'AICoach' }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Reyting' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 56,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    width: 56,
    height: 36,
  },
});

export default MainTabs;
