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
        name="Join"
        component={JoinScreen}
        options={{ headerShown: true, headerTitle: '설정' }}
      />
      <Stack.Screen
        name="TravelCreate"
        component={TravelCreateScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="TravelComplete"
        component={TravelCompleteScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="EndTripScreen"
        component={EndTripScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="StartTripScreen"
        component={StartTripScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="ChecklistScreen"
        component={ChecklistSection}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="MemoScreen"
        component={MemoScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="OnTripScreen"
        component={OnTripScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
    </Stack.Navigator>
  );
}

export default TripStack;
