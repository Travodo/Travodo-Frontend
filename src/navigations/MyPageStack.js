import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';
import SettingsScreen from '../screens/Setting/SettingsScreen';
import LasttripScreen from '../screens/myPage/LasttripScreen';
import ProfileScreen from '../screens/myPage/ProfileScreen';
import ProfileEditScreen from '../screens/myPage/ProfileEditScreen';
import MyWriteTrip from '../screens/myPage/MyWriteTrip';
import CommunityScrap from '../screens/community/CommunityScrap';

const Stack = createNativeStackNavigator();

function MyPageStack() {
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
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: true, headerTitle: '설정' }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: '내 프로필',
        }}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={{
          headerTitle: '프로필 수정',
        }}
      />
      <Stack.Screen
        name="LasttripScreen"
        component={LasttripScreen}
        options={{
          headerTitle: '지난 여행 관리',
        }}
      />
      <Stack.Screen
        name="CommunityScrap"
        component={CommunityScrap}
        options={{
          headerTitle: '저장한 글',
        }}
      />
      <Stack.Screen
        name="MyWriteTrip"
        component={MyWriteTrip}
        options={{
          headerTitle: '내가 쓴 글',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default MyPageStack;
