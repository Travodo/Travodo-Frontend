import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/homeScreen/homeScreen';
import PrepareScreen from '../screens/preTrip/PrepareScreen';
import StartTripScreen from '../screens/loadingScreen/StartTripScreen';
import OnTripScreen from '../screens/preTrip/OnTripScreen';
import EndTripScreen from '../screens/loadingScreen/EndTripScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Prepare" component={PrepareScreen} options={{ headerShown: false }} />

      <Stack.Screen name="StartTrip" component={StartTripScreen} options={{ headerShown: false }} />

      <Stack.Screen name="OnTrip" component={OnTripScreen} options={{ headerShown: false }} />

      <Stack.Screen name="EndTrip" component={EndTripScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeStack;
