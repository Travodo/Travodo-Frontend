import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import { colors } from '../styles/colors';
import Empty from '../screens/Empty';
import CommunityContent from '../screens/community/CommunityContent';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Empty">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Empty" component={CommunityContent} />
    </Stack.Navigator>
  );
}

export default MainStack;
