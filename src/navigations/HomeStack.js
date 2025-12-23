import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';

import HomeScreen from '../screens/homeScreen/HomeScreen';
import JoinScreen from '../screens/homeScreen/JoinScreen';
import TravelCompleteScreen from '../screens/homeScreen/TravelCompleteScreen';
import TravelCreateScreen from '../screens/homeScreen/TravelCreateScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
      />

      <Stack.Screen
        name="TravelCreate"
        component={TravelCreateScreen}
      />

      <Stack.Screen
        name="TravelComplete"
        component={TravelCompleteScreen}
      />

      <Stack.Screen
        name="Join"
        component={JoinScreen}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
