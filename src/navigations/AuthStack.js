import React from 'react';
import { Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import ArrowButton from '../components/ArrowButton';

import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import SignInScreen from '../screens/sign/SignInScreen';
import SignUpScreen from '../screens/sign/SignUpScreen';
import ForgotPw from '../screens/sign/ForgotPw';
import PwStep1 from '../screens/sign/PwStep1';
import PwStep2 from '../screens/sign/PwStep2';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: colors.grayscale[300],
        },
        headerTitleStyle: {
          fontFamily: 'Pretendard-Regular',
          fontSize: 15,
          color: colors.grayscale[900],
        },
      }}
    >
      <Stack.Screen
        name="OnBoarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ForgotPw"
        component={ForgotPw}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '아이디/비밀번호 찾기',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 16 }}
              hitSlop={12}
            >
              <ArrowButton rotateDeg={225} />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="PwStep1"
        component={PwStep1}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '아이디/비밀번호 찾기',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 16 }}
              hitSlop={12}
            >
              <ArrowButton rotateDeg={225} />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="PwStep2"
        component={PwStep2}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '아이디/비밀번호 찾기',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 16 }}
              hitSlop={12}
            >
              <ArrowButton rotateDeg={225} />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
