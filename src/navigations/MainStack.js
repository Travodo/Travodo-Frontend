import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import CommunityContent from '../screens/community/CommunityContent';
const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />
      <Stack.Screen
        name="CommunityContent"
        component={CommunityContent}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
