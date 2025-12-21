import { View, StyleSheet, Text, Pressable } from 'react-native';
import RadioButton from './RadioButton';
import { colors } from '../styles/colors';
import propTypes from 'prop-types';
import PropTypes from 'prop-types';

function SelectMyTrip({ title, startDate, endDate, circleColor, isSelected, onPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Pressable onPress={onPress}>
          <RadioButton checked={isSelected} />
        </Pressable>
        <View style={styles.tripContainer}>
          <View style={styles.titleContaier}>
            <View
              style={[
                styles.circle,
                circleColor ? { backgroundColor: circleColor } : { backgroundColor: '#769fff' },
              ]}
            />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.date}>{`${startDate} - ${endDate}`}</Text>
        </View>
      </View>
    </View>
  );
}

SelectMyTrip.propTypes = {
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  circleColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  wrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  tripContainer: {
    paddingTop: 23,
    paddingBottom: 23,
    backgroundColor: colors.grayscale[200],
    width: 300,
    gap: 5,
    borderRadius: 20,
    paddingLeft: 28,
  },
  titleContaier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#769fff',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
});

export default SelectMyTrip;
