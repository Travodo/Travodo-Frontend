import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';
import TravelCreateScreen from '../screens/homeScreen/TravelCreateScreen';
import TravelCompleteScreen from '../screens/homeScreen/TravelCompleteScreen';
import JoinScreen from '../screens/homeScreen/JoinScreen';

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
        name="JoinScreen"
        component={JoinScreen}
        options={{ headerShown: true, headerTitle: '설정' }}
      />
      <Stack.Screen
        name="TravelCreateScreen"
        component={TravelCreateScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="TravelCompleteScreen"
        component={TravelCompleteScreen}
        options={{
          headerTitle: '글쓰기',
        }}
      />
    </Stack.Navigator>
  );
}

export default TripStack;
