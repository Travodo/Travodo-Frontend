import { createBottomTabNavigatora } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import ComunityHome from '../screens/ComunityHome';

const Tap = createBottomTabNavigator();

function BottomTap() {
  return <Tap.navigator initialRouteName="asd" />;
}
