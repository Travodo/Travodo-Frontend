import { View } from 'react-native';
import TabButton from '../components/TabButton';
import HomeTabIcon from '../../assets/ComponentsImage/HomeTabIcon.svg';
import CommunityTripPlan from '../components/CommunityTripPlan';

function Empty() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
    >
      <CommunityTripPlan />
    </View>
  );
}

export default Empty;
