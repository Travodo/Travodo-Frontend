import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigations/MainStack';
import BottomTab from './navigations/BottomTab';
import AuthStack from './navigations/AuthStack';

function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthStack />
    </NavigationContainer>
  );
}

export default App;
