import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import CommunityHome from '../screens/community/CommunityHome';
import HomeTabIcon from '../../assets/ComponentsImage/HomeTabIcon.svg';
import CommunityTabIcon from '../../assets/ComponentsImage/CommunityTabIcon.svg';
import MapsTabIcon from '../../assets/ComponentsImage/MapsTabIcon.svg';
import { colors } from '../styles/colors';
import TravodoLogo from '../../assets/Logo/TravodoLogo.svg';
import HeaderScrap from '../components/HeaderScrap';
import OptionButton from '../components/OptionButton';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: '',
        headerLeft: () => <TravodoLogo width={100} height={20} marginLeft={32} />,
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <HeaderScrap
              style={{ marginRight: 15 }}
              size={16}
              onPress={() => console.log('스크랩')}
            />
            <OptionButton size={16} onPress={() => console.log('환경설정')} />
          </View>
        ),
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
