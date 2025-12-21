import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import { colors } from '../styles/colors';
import { View } from 'react-native';
import CommunityStack from './CommunityStack';
import TripStack from './TripStack';
import MyPageStack from './MyPageStack';
const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
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
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false, headerBackground: undefined }}
      />
      <Stack.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="TripStack"
        component={TripStack}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{
          headerTitle: '글쓰기',
        }}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
