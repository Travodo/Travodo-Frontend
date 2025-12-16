import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function CommunityTripPlan({ title, date, location, people, todo, circleColor }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <View
              style={[styles.circle, { backgroundColor: circleColor || colors.primary[700] }]}
            />
            <Text style={styles.title}>{title}</Text>
          </View>
          <View>
            <Text>{date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>여행지</Text>
          <Text style={styles.contentText}>{location}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>여행 기간</Text>
          <Text style={styles.contentText}>{date}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>동행 인원</Text>
          <Text style={styles.contentText}>{people}인</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>TODO</Text>
          <Text style={styles.contentText}>{todo}</Text>
        </View>
      </View>
    </View>
  );
}

CommunityTripPlan.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  people: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  circleColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wrap: {
    width: '90%',
  },
  container: {
    backgroundColor: colors.grayscale[200],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    marginVertical: 23,
    marginHorizontal: 28,
    gap: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 17,
    height: 17,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
  bottomContainer: {
    marginHorizontal: 28,
    marginVertical: 22.5,
    gap: 18,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  contentForm: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
  },
  contentText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
});

export default CommunityTripPlan;
