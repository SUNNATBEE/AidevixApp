import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth } from '../store/slices/authSlice';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import DailyChallengeScreen from '../screens/challenge/DailyChallengeScreen';
import { RootStackParamList } from './types';
import Loader from '../components/common/Loader';

const Stack = createNativeStackNavigator<RootStackParamList>();

// MUHIM: bu yerda global auth.loading ga qaramaymiz. Aks holda har bir login/register
// urinishi paytida NavigationContainer unmount bo'lib, navigation prop'i yo'qoladi
// (masalan, LoginScreen → VerifyEmail o'tishi ishlamay qoladi).
const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => setInitialCheckDone(true));
  }, [dispatch]);

  if (!initialCheckDone) {
    return <Loader fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="DailyChallenge"
              component={DailyChallengeScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
