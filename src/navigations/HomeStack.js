import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/homeScreen/HomeScreen';
import PrepareScreen from '../screens/preTrip/PrepareScreen';
import StartTripScreen from '../screens/loadingScreen/StartTripScreen';
import OnTripScreen from '../screens/preTrip/OnTripScreen';
import EndTripScreen from '../screens/loadingScreen/EndTripScreen';
import JoinScreen from '../screens/homeScreen/JoinScreen';
import TravelCreateScreen from '../screens/homeScreen/TravelCreateScreen';
import TravelCompleteScreen from '../screens/homeScreen/TravelCompleteScreen';
import ChecklistSection from '../screens/preTrip/ChecklistSection';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Prepare" component={PrepareScreen} options={{ headerShown: false }} />

      <Stack.Screen name="StartTrip" component={StartTripScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />

      <Stack.Screen name="OnTrip" component={OnTripScreen} options={{ headerShown: false }} />

      <Stack.Screen name="EndTrip" component={EndTripScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="Join" component={JoinScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TravelCreate" component={TravelCreateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TravelComplete" component={TravelCompleteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChecklistScreen" component={ChecklistSection} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeStack;
