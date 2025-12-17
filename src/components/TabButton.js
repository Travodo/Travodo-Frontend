import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';
import HomeTabIcon from '../../assets/ComponentsImage/HomeTabIcon.svg';
import CommunityTabIcon from '../../assets/ComponentsImage/CommunityTabIcon.svg';
import MapsTabIcon from '../../assets/ComponentsImage/MapsTabIcon';

function TabButton({ size }) {
  return (
    <Pressable style={styles.button}>
      <HomeTabIcon width={size} height={size} />
      <Text style={styles.text}>홈</Text>
    </Pressable>
  );
}

TabButton.propTypes = {
  size: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: colors.grayscale[1000],
  },
});

export default TabButton;
