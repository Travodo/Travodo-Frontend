import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUpcomingTrips } from '../../services/api';

function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUpcoming = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await getUpcomingTrips();
      // 서버/프록시 환경에 따라 배열이 아닌 래핑 객체로 올 수 있어 방어
      const list = Array.isArray(raw) ? raw : (raw?.trips ?? raw?.data ?? []);
      const mapped = (list || []).map((t) => ({
        id: t.id,
        name: t.name,
        destination: t.place,
        place: t.place,
        startDate: String(t.startDate || '').replace(/-/g, '.'),
        endDate: String(t.endDate || '').replace(/-/g, '.'),
        dDay: t.dDay,
        color: t.color,
        status: t.status,
        companions: [],
      }));
      setTrips(mapped);
    } catch (e) {
      console.error('다가오는 여행 조회 실패:', e);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 홈으로 돌아올 때마다 갱신 (여행 생성 후에도 자동 반영)
  useFocusEffect(
    useCallback(() => {
      loadUpcoming();
    }, [loadUpcoming]),
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never" bounces={false}>
        <Text style={styles.headerText}>나의 캘린더</Text>
        <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>
        <CalendarView trips={trips} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 여행</Text>
          <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[700]} />
          ) : trips.length === 0 ? (
            <Text style={styles.emptyText}>아직 계획된 여행이 없어요!</Text>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </View>
      </ScrollView>

      <FAB
        icon="add"
        onCreatePress={() =>
          navigation.navigate('TripStack', {
            screen: 'TravelCreate',
          })
        }
        onJoinPress={() =>
          navigation.navigate('TripStack', {
            screen: 'Join',
          })
        }
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
    marginTop: 36,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: colors.primary[700],
  },
});
