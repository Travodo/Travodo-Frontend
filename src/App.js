import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import HomeScreen from './screens/HomeScreen/HomeScreen';
import TravelCreateScreen from './screens/HomeScreen/TravelCreateScreen';
import TravelCompleteScreen from './screens/HomeScreen/TravelCompleteScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="TravelCreate"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TravelCreate" component={TravelCreateScreen} />
          <Stack.Screen name="TravelComplete" component={TravelCompleteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default App;
