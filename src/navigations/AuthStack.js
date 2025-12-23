import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
          height: 56,
          borderBottomWidth: 1, 
          borderBottomColor: colors.grayscale[600],
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
              style={{ paddingLeft: 16, paddingVertical: 16, paddingRight: 16 }}
              hitSlop={12}
            >
              <View style={{ transform: [{scale: 1.5}]}}>
              <ArrowButton rotateDeg={225} />
              </View>
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
              style={{ paddingLeft: 16, paddingVertical: 16, paddingRight: 16 }}
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
              style={{ paddingLeft: 16, paddingVertical: 16, paddingRight: 16 }}
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
