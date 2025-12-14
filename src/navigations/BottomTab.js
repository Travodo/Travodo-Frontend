import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import CommunityHome from '../screens/community/CommunityHome';
import HomeTabIcon from '../../assets/ComponentsImage/HomeTabIcon.svg';
import CommunityTabIcon from '../../assets/ComponentsImage/CommunityTabIcon.svg';
import MapsTabIcon from '../../assets/ComponentsImage/MapsTabIcon.svg';
import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.grayscale[900],
        tabBarInactiveTintColor: colors.grayscale[400],
        tabBarLabelStyle: styles.font,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <HomeTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityHome}
        options={{
          title: '커뮤니티',
          tabBarIcon: ({ color, size }) => <CommunityTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Maps"
        component={CommunityHome}
        options={{
          title: '지도',
          tabBarIcon: ({ color, size }) => <MapsTabIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
});

export default BottomTab;
