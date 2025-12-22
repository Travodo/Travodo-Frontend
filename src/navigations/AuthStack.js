import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import SignInScreen from '../screens/sign/SignInScreen';
import SignUpScreen from '../screens/sign/SignUpScreen';
import ForgotPw from '../screens/sign/ForgotPw';
import PwStep1 from '../screens/sign/PwStep1';
import PwStep2 from '../screens/sign/PwStep2';

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
      <Stack.Screen name="ForgotPw" component={ForgotPw} options={{ headerShown: false }} />
      <Stack.Screen name="PwStep1" component={PwStep1} options={{ headerShown: false }} />
      <Stack.Screen name="PwStep2" component={PwStep2} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
