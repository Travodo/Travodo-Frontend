import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import MyPageStack from './MyPageStack';
import CommunityStack from './CommunityStack';

const Stack = createNativeStackNavigator();

function RootNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={BottomTab} />
      <Stack.Screen name="MyPageStack" component={MyPageStack} />
      <Stack.Screen name="CommunityStack" component={CommunityStack} />
    </Stack.Navigator>
  );
}

export default RootNavigation;
