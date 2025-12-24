import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuth } from '../contexts/AuthContext';

function RootNavigation() {
  const { isBootstrapped, isLoggedIn } = useAuth();

  // 토큰 복구 전에는 네비게이션을 띄우지 않아 화면 튐 방지
  if (!isBootstrapped) return null;

  return <NavigationContainer>{isLoggedIn ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}

export default RootNavigation;