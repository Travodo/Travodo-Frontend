import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainStack from './MainStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="OnBoarding">
      <Stack.Screen
        name="OnBoarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Sign In" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTab" component={MainStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
