import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';

import HomeScreen from './screens/HomeScreen/HomeScreen';
import TravelCreateScreen from './screens/HomeScreen/TravelCreateScreen';
import TravelCompleteScreen from './screens/homeScreen/TravelCompleteScreen';
import JoinScreen from './screens/HomeScreen/JoinScreen';
import LasttripScreen from './screens/Setting/LasttripScreen';
import ProfileScreen from './screens/Setting/ProfileScreen';
import SettingItem from './components/SettingItem';
import SettingScreen from './screens/Setting/SettingsScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  return <SettingScreen />;
}

export default App;
