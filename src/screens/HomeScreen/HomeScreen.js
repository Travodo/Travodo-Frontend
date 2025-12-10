import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarView from '../../components/Calendar';
import TripCard from '../../components/TripCard';
import FAB from '../../components/FAB';
import { colors } from '../../styles/colors';
import { upcomingTrips as dummyTrips } from '../../data/TripList';

export default function HomeScreen({ navigation }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTrips(dummyTrips);
        setLoading(false);
    }, []);

    return (
        <View style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.headerText}>나의 캘린더</Text>
                <Text style={styles.subText}>오늘의 일정을 확인해보세요!</Text>

                <CalendarView />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>다가오는 여행</Text>
                    <Text style={styles.sectionSub}>곧 설레는 여행이 시작됩니다!</Text>


                    { loading ? (
                        <ActivityIndicator size="large" color={colors.primary[700]} />
                    ) : (
                        trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))
                    )}
                </View>
            </ScrollView>

            <FAB icon="add" 
            onCreatePress={() => navigation.navigate('CreateTrip')}
            onJoinPress={() => console.log('여행 참가')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayscale[100],
        paddingHorizontal: 20,
    },

    headerText: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 20,
        marginTop: 24
    },

    subText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15,
        color: colors.grayscale[700],
        marginBottom: 12
    },

    section: {
        marginTop: 40
    },

    sectionTitle: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 18,
        fontWeight: '600'
    },
    
    sectionSub: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14,
        color: colors.grayscale[700],
        marginBottom: 12
    },
});