import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUpcomingTrips, getCurrentTrip } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ route }) {
  const navigation = useNavigation();

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [ongoingTrip, setOngoingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTripsData = useCallback(async () => {
  setLoading(true);
  try {
    console.log('[HomeScreen] 여행 데이터 로딩 시작...');

    const storedTripData = await AsyncStorage.getItem('@current_trip_data');
    const currentData = await getCurrentTrip();
    
    if (currentData?.id) {
      if (storedTripData) {
        try {
          const parsedTrip = JSON.parse(storedTripData);
          if (String(parsedTrip.id) === String(currentData.id)) {
            console.log('[HomeScreen] 저장된 trip 데이터 사용 (API 호출 최소화)');
            setOngoingTrip(parsedTrip);
          } else {
            setOngoingTrip(currentData);
          }
        } catch (e) {
          setOngoingTrip(currentData);
        }
      } else {
        setOngoingTrip(currentData);
      }
    } else {
      setOngoingTrip(null);
      await AsyncStorage.removeItem('@current_trip_data');
    }

    const upcomingData = await getUpcomingTrips();
    const list = Array.isArray(upcomingData)
      ? upcomingData
      : (upcomingData?.trips ?? upcomingData?.data ?? []);

    setUpcomingTrips(list);

    console.log('[HomeScreen] ONGOING 여행:', ongoingTrip ? ongoingTrip.name : '없음');
    console.log('[HomeScreen] UPCOMING 여행:', list.length, '개');

  } catch (e) {
    console.error('[HomeScreen] 여행 데이터 로딩 실패:', e.message);
    setUpcomingTrips([]);
    setOngoingTrip(null);
  } finally {
    setLoading(false);
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      loadTripsData();
    }, [loadTripsData]),
  );

  const allTrips = ongoingTrip ? [ongoingTrip, ...upcomingTrips] : upcomingTrips;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never" bounces={false}>
        <Text style={styles.headerText}>나의 캘린더</Text>
        <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>
        <CalendarView trips={allTrips} />

        {ongoingTrip && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>진행 중인 여행</Text>
            <Text style={styles.sectionSub}>현재 여행을 즐기고 계시네요! 🎉</Text>
            <TripCard trip={ongoingTrip} skipApiCall={true} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 여행</Text>
          <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[700]} />
          ) : !ongoingTrip && upcomingTrips.length === 0 ? (
            <Text style={styles.emptyText}>아직 계획된 여행이 없어요!</Text>
          ) : upcomingTrips.length === 0 ? (
            <Text style={styles.emptyText}>다가오는 여행이 없어요!</Text>
          ) : (
            upcomingTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </View>
      </ScrollView>

      <FAB
        icon="add"
        onCreatePress={() => navigation.navigate('TravelCreate')}
        onJoinPress={() => navigation.navigate('Join')}
        onWritePress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'CommunitySelectWriteTrip',
          })
        }
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 4,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginBottom: 3,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[900],
    marginBottom: 20,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    marginBottom: 4,
    marginTop: 30,
  },
  sectionSub: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[800],
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: colors.primary[700],
    marginBottom: 100,
  },
});
