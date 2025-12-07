import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { colors } from "../styles/colors";

export default function TripCard({ trip }) {
    const renderDDay = () => (trip.dDay === 0 ? '오늘!' : `D-${trip.dDay}`);

    return (
        <View style={[styles.card, { borderLeftColor: trip.color }]} >
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.dDay}>{renderDDay()}</Text>
            <Text style={styles.date}>{trip.startDate} - {trip.endDate}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.grayscale[200],
        borderRadius: 10,
        borderLeftWidth: 6,
        paddingLeft: 16,
        paddingVertical: 13,
        marginBottom: 15,
        shadowColor: colors.grayscale[1000],
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },

    title: { fontSize: 16, fontWeight: '600', fontFamily: 'Pretendard-Medium', },
    dDay: { fontSize: 15, color: '#769FFF', marginVertical: 2 },
    date: { fontSize: 13, color: colors.grayscale[700] }
});