import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { colors } from '../styles/colors';

import HomeScreen from '../screens/homeScreen/HomeScreen';
import JoinScreen from '../screens/homeScreen/JoinScreen';
import TravelCreateScreen from '../screens/homeScreen/TravelCreateScreen';
import TravelCompleteScreen from '../screens/homeScreen/TravelCompleteScreen';

import PrepareScreen from '../screens/preTrip/PrepareScreen';
import StartTripScreen from '../screens/loadingScreen/StartTripScreen';
import OnTripScreen from '../screens/preTrip/OnTripScreen';
import EndTripScreen from '../screens/loadingScreen/EndTripScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTopInsetEnabled: false,
        headerStyle: { height: 56 },
        headerTitle: '',
        headerTitleContainerStyle: { paddingBottom: 0 },
        headerLeftContainerStyle: { paddingLeft: 16 },
        headerRightContainerStyle: { paddingRight: 16 },
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
      {/* 홈 */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* 여행 생성 */}
      <Stack.Screen
        name="TravelCreate"
        component={TravelCreateScreen}
        options={{ headerShown: false }}
      />

      {/* 여행 생성 완료 */}
      <Stack.Screen
        name="TravelComplete"
        component={TravelCompleteScreen}
        options={{ headerShown: true }}
      />

      {/* 여행 참가 */}
      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={{ headerShown: true }}
      />

      {/* 여행 준비 리스트 */}
      <Stack.Screen
        name="Prepare"
        component={PrepareScreen}
        options={{ headerShown: true }}
      />

      {/* 여행 TODO 시작 */}
      <Stack.Screen
        name="StartTrip"
        component={StartTripScreen}
        options={{ headerShown: true }}
      />

      {/* 여행 중 TODO */}
      <Stack.Screen
        name="OnTrip"
        component={OnTripScreen}
        options={{ headerShown: true }}
      />

      {/* 여행 기록 완료 (몰입 화면) */}
      <Stack.Screen
        name="EndTrip"
        component={EndTripScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
