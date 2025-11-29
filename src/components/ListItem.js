import { View, StyleSheet, Text } from 'react-native';
import ToggleSwitch from './ToggleSwitch';
import ArrowButton from './ArrowButton';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function ListItem({ text, toggleDisable, arrowDisable }) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {toggleDisable || <ToggleSwitch />}
        <Text style={[styles.text]}>{text}</Text>
      </View>
      <View>{arrowDisable || <ArrowButton rotateDeg={45} />}</View>
    </View>
  );
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  toggledisable: PropTypes.bool,
  arrowDisable: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.grayscale[300],
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  toggleContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    flex: 1,
    fontSize: 16,
  },
});

export default ListItem;
