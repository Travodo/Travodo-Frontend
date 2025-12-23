import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import CommunityHome from '../screens/community/CommunityHome';
import HomeTabIcon from '../../assets/ComponentsImage/HomeTabIcon.svg';
import CommunityTabIcon from '../../assets/ComponentsImage/CommunityTabIcon.svg';
import MapsTabIcon from '../../assets/ComponentsImage/MapsTabIcon.svg';
import { colors } from '../styles/colors';
import TravodoLogo from '../../assets/Logo/TravodoLogo.svg';
import HeaderScrap from '../components/HeaderScrap';
import OptionButton from '../components/OptionButton';
import Maps from '../screens/maps/Maps';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: '',
        headerLeft: () => <TravodoLogo width={100} height={20} marginLeft={32} />,
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <HeaderScrap
              style={{ marginRight: 15 }}
              size={16}
              onPress={() => navigation.navigate('MyPageStack', { screen: 'CommunityScrap' })}
            />
            <OptionButton
              size={16}
              onPress={() => navigation.navigate('MyPageStack', { screen: 'SettingsScreen' })}
            />
          </View>
        ),
        tabBarActiveTintColor: colors.grayscale[900],
        tabBarInactiveTintColor: colors.grayscale[400],
        tabBarLabelStyle: styles.font,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
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
        component={Maps}
        options={{
          headerShown: false,
          title: 'Maps',
          tabBarIcon: ({ color, size }) => <MapsTabIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    marginRight: 20,
  },
  font: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
});

export default BottomTab;