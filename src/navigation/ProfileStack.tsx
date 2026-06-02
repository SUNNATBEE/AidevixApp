import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CertificatesScreen from '../screens/profile/CertificatesScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import FollowScreen from '../screens/profile/FollowScreen';
import MyCoursesScreen from '../screens/profile/MyCoursesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ReferralsScreen from '../screens/profile/ReferralsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyCourses" component={MyCoursesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Certificates" component={CertificatesScreen} />
      <Stack.Screen name="Follow" component={FollowScreen} />
      <Stack.Screen name="Referrals" component={ReferralsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
