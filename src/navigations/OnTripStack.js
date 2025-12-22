import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';

import PrepareScreen from '../screens/preTrip/PrepareScreen';
import StartTripScreen from '../screens/loadingScreen/StartTripScreen';
import OnTripScreen from '../screens/preTrip/OnTripScreen';
import EndTripScreen from '../screens/loadingScreen/EndTripScreen';

const Stack = createNativeStackNavigator();

function OnTripStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Pretendard-Regular',
          fontSize: 16,
        },
        headerShadowVisible: false,
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: colors.grayscale[300],
            }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Prepare"
        component={PrepareScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />

      <Stack.Screen
        name="StartTrip"
        component={StartTripScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OnTrip"
        component={OnTripScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />

      <Stack.Screen
        name="EndTrip"
        component={EndTripScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default OnTripStack;