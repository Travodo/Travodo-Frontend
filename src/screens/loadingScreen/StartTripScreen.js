import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import TripCard from '../../components/TripCard';
import { colors } from '../../styles/colors';

function StartTripScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    trip,
    travelers = [],
    necessity = [],
    shared = [],
    personal = [],
    activities = [],
    memos = [],
  } = route.params || {};

  useEffect(() => {
    if (!trip) return;

    const timer = setTimeout(() => {
      navigation.replace('OnTrip', {
        trip,
        travelers,
        necessity,
        shared,
        personal,
        activities,
        memos,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [trip, travelers, necessity, shared, personal, activities, memos, navigation]);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>여행 정보를 불러올 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dDayText}>D-DAY</Text>
      <Text style={styles.subText}>여행이 시작되었습니다!</Text>
      <Text style={styles.subText}>Travodo와 즐거운 여행을!</Text>

      <View style={styles.cardWrapper}>
        <TripCard trip={trip} hideActions={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 200,
  },

  dDayText: {
    fontSize: 40,
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[100],
    marginBottom: 24,
  },

  subText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[100],
    marginBottom: 12,
  },

  cardWrapper: {
    marginTop: 40,
    width: '100%',
  },

  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[600],
  },
});

export default StartTripScreen;