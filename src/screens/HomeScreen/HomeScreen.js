import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';

function HomeScreen({ route }) {
  const navigation = useNavigation();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const newTrip = route?.params?.tripData;

  const calculateDday = (startDate) => {
    if (!startDate) return null;
    const today = new Date();
    const start = new Date(startDate.replace(/\./g, '-'));
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (newTrip) {
      setTrips((prevTrips) => [
        ...prevTrips,
        {
          id: Date.now(),
          title: newTrip.name,
          location: newTrip.destination,
          startDate: newTrip.startDate,
          endDate: newTrip.endDate,
          companions: newTrip.companions,
          color: newTrip.color,
          dDay: calculateDday(newTrip.startDate),
        },
      ]);

      navigation.setParams({ tripData: undefined });
    }
  }, [newTrip]);

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
        onCreatePress={() => navigation.navigate('Create')}
        onJoinPress={() => navigation.navigate('Join')}
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
    paddingTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginBottom: 6,
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
    marginBottom: 6,
    marginTop: 30,
  },
  sectionSub: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[800],
    marginBottom: 8,
  },

  emptyText: {
    marginTop: 36,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: colors.primary[700],
  },
});
