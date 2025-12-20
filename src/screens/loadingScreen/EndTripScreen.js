import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import TripCard from '../../components/TripCard';
import { colors } from '../../styles/colors';

function EndTripScreen() {
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
      <Text style={styles.subText}>여행 기록 완료!</Text>
      <Text style={styles.subText}>잊지 못할 추억을 커뮤니티에 공유해보세요.</Text>

      <View style={styles.cardWrapper}>
        <TripCard trip={trip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[50],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dDayText: {
    fontSize: 48,
    fontFamily: 'Pretendard-Bold',
    color: colors.primary[700],
    marginBottom: 16,
  },
  subText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[700],
    marginBottom: 8,
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