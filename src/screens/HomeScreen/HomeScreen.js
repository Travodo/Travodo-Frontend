import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { upcomingTrips as dummyTrips } from '../../data/TripList';

function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateDday = (startDate) => {
    const today = new Date();
    const start = new Date(startDate.replace(/\./g, '-'));
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const updatedTrips = dummyTrips.map((trip) => ({
      ...trip,
      dDay: calculateDday(trip.startDate),
    }));
    setTrips(updatedTrips);
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
        <Text style={styles.headerText}>나의 캘린더</Text>
        <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>
        <CalendarView />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 여행</Text>
          <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>
=======
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>나의 캘린더</Text>
        <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>

        <CalendarView />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다가오는 여행</Text>
          <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>

>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[700]} />
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </View>
      </ScrollView>

      <FAB
        icon="add"
        onCreatePress={() => navigation.navigate('CreateTrip')}
        onJoinPress={() => console.log('여행 참가')}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  headerRightContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    marginRight: 20,
  },
=======
>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 20,
  },
<<<<<<< HEAD
=======

>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
  headerText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    marginTop: 24,
  },
<<<<<<< HEAD
=======

>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
  subText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: colors.grayscale[700],
    marginBottom: 12,
  },
<<<<<<< HEAD
  section: {
    marginTop: 40,
  },
=======

  section: {
    marginTop: 40,
  },

>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
  sectionTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
<<<<<<< HEAD
=======

>>>>>>> 42ad76a8c388c9d7a6c000be5fccad7bc2f8aafe
  sectionSub: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.grayscale[700],
    marginBottom: 12,
  },
});
