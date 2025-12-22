import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { View } from 'react-native';

import SettingsScreen from '../screens/Setting/SettingsScreen';

const Stack = createNativeStackNavigator();

function SettingStack() {
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
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: true, headerTitle: "설정" }}
      />

    </Stack.Navigator>
  );
}

export default SettingStack;