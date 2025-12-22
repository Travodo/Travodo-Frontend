import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityWrite from './screens/community/CommunityWrite';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="CommunityWrite"
          component={CommunityWrite}
          options={{ title: '글쓰기' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
