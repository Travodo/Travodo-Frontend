import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUpcomingTrips, getCurrentTrip } from '../../services/api';

function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongoingTrips, setOngoingTrips] = useState([]);

  // 데이터 가져오기 함수
  const fetchTripsData = async () => {
    // 이미 로딩 중이 아니라면 로딩 표시 (UX에 따라 첫 로딩만 표시할 수도 있음)
    // setLoading(true);

    try {
      console.log('홈 화면 데이터 갱신 중...'); // 디버깅용 로그

      // 1. 현재 진행 중인 여행
      const currentTripResponse = await getCurrentTrip();
      if (currentTripResponse && currentTripResponse.id) {
        setOngoingTrips([currentTripResponse]);
      } else {
        setOngoingTrips([]);
      }

      // 2. 다가오는 여행
      const upcomingTripsResponse = await getUpcomingTrips();
      if (Array.isArray(upcomingTripsResponse)) {
        setTrips(upcomingTripsResponse);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('여행 데이터 가져오기 실패:', error);
      // Alert.alert('오류', '여행 정보를 불러오는데 실패했습니다.'); // 너무 잦은 알림 방지
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때 + refresh 파라미터가 바뀔 때 실행
  useFocusEffect(
    useCallback(() => {
      fetchTripsData();
    }, [route.params?.refresh]), // route.params.refresh가 변경되면 재실행
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never" bounces={false}>
        <Text style={styles.headerText}>나의 캘린더</Text>
        <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[700]} />
          </View>
        ) : (
          <>
            <CalendarView trips={[...ongoingTrips, ...trips]} />

            {/* 현재 진행 중인 여행 */}
            {ongoingTrips.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>지금 여행 중! ✈️</Text>
                {ongoingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}

            {/* 다가오는 여행 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>다가오는 여행</Text>
              <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>
              {trips.length === 0 ? (
                <Text style={styles.emptyText}>아직 계획된 여행이 없어요!</Text>
              ) : (
                trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
              )}
            </View>
          </>
        )}
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
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 36,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: colors.primary[700],
  },
});
