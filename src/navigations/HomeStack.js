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
        headerTitle: '',
        headerShadowVisible: false,
        headerTopInsetEnabled: false,
        headerStyle: {
          height: 56,
        },
        headerTitleContainerStyle: {
          paddingBottom: 0,
        },
        headerLeftContainerStyle: {
          paddingLeft: 16,
          paddingBottom: 0,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
          paddingBottom: 0,
        },
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
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TravelCreate"
        component={TravelCreateScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TravelComplete"
        component={TravelCompleteScreen}
        options={{ headerShown: true, headerTitle: '' }}
      />

      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={{ headerShown: true, headerTitle: '' }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
