import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';
import TravelCreateScreen from '../screens/homeScreen/TravelCreateScreen';
import TravelCompleteScreen from '../screens/homeScreen/TravelCompleteScreen';
import JoinScreen from '../screens/homeScreen/JoinScreen';
import EndTripScreen from '../screens/loadingScreen/EndTripScreen';
import StartTripScreen from '../screens/loadingScreen/StartTripScreen';
import ChecklistSection from '../screens/preTrip/ChecklistSection';
import MemoScreen from '../screens/preTrip/MemoScreen';
import OnTripScreen from '../screens/preTrip/OnTripScreen';
import PrepareScreen from '../screens/preTrip/PrepareScreen';

const Stack = createNativeStackNavigator();

function TripStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="Join" component={JoinScreen} />
      <Stack.Screen name="TravelCreate" component={TravelCreateScreen} />
      <Stack.Screen name="TravelComplete" component={TravelCompleteScreen} />
      <Stack.Screen name="EndTrip" component={EndTripScreen} />
      <Stack.Screen name="StartTrip" component={StartTripScreen} />
      <Stack.Screen name="ChecklistScreen" component={ChecklistSection} />
      <Stack.Screen name="MemoScreen" component={MemoScreen} />
      <Stack.Screen name="OnTrip" component={OnTripScreen} />
      <Stack.Screen name="Prepare" component={PrepareScreen} />
    </Stack.Navigator>
  );
}

export default TripStack;
