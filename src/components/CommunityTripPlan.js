import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function CommunityTripPlan({ title, startDate, endDate, location, people, todo, circleColor }) {
  const getTodoText = () => {
    if (!todo) return '일정 없음';

    if (typeof todo === 'string') return todo;
    try {
      const allTasks = Object.values(todo).flat();
    } catch (e) {
      return '일정 확인 필요';
    }
  };

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
            <Text>{`${startDate} - ${endDate}`}</Text>
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
          <Text style={styles.contentText}>{`${startDate} - ${endDate}`}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>동행 인원</Text>
          <Text style={styles.contentText}>{people}인</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentForm}>TODO</Text>
          <Text style={styles.contentText}>{getTodoText()}</Text>
        </View>
      </View>
    </View>
  );
}

CommunityTripPlan.propTypes = {
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
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
