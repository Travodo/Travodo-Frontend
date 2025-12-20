import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen/HomeScreen';
import TravelCreateScreen from './screens/HomeScreen/TravelCreateScreen';
import PrepareScreen from './screens/preTrip/PrepareScreen';
import StartTripScreen from './screens/loadingScreen/StartTripScreen';
import OnTripScreen from './screens/preTrip/OnTripScreen';
import MemoScreen from './screens/preTrip/MemoScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={TravelCreateScreen} />
        <Stack.Screen name="Prepare" component={PrepareScreen} />

        <Stack.Screen
          name="StartTripLoading"
          component={StartTripScreen}
        />

        <Stack.Screen name="OnTrip" component={OnTripScreen} />

        <Stack.Screen name="Memo" component={MemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
