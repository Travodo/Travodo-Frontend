import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuth } from '../contexts/AuthContext';

function RootNavigation() {
  const { isLoggedIn } = useAuth();
  return <NavigationContainer>{isLoggedIn ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}

export default RootNavigation;
