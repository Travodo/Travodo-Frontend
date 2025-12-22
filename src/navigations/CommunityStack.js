import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import CommunityContent from '../screens/community/CommunityContent';
import CommunitySelectWriteTrip from '../screens/community/CommunitySelectWriteTrip';
import { colors } from '../styles/colors';
import { View } from 'react-native';
import CommunityWrite from '../screens/community/CommunityWrite';
import CommunityScrap from '../screens/community/CommunityScrap';
const Stack = createNativeStackNavigator();

function CommunityStack() {
  return (
    <Stack.Navigator
      initialRouteName="CommunitySelectWriteTrip"
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
        name="CommunityContent"
        component={CommunityContent}
        options={{ headerShown: true, headerTitle: '커뮤니티' }}
      />
      <Stack.Screen
        name="CommunitySelectWriteTrip"
        component={CommunitySelectWriteTrip}
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Stack.Screen
        name="CommunityWrite"
        component={CommunityWrite}
        options={{
          headerTitle: '글쓰기',
        }}
      />
    </Stack.Navigator>
  );
}

export default CommunityStack;
