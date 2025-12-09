import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { colors } from "../styles/colors";

export default function TripCard({ trip }) {
    const renderStatusText = () => {
        if (trip.dDay !== undefined && trip.dDay !== null) {
        return trip.dDay === 0 ? '오늘!' : `D-${trip.dDay}`;
        }

        if (trip.startDate) {
            return null;
        }
    };

    const statusText = renderStatusText();

    return (
        <View style={[styles.card, { borderLeftColor: trip.color }]} >
            <Text style={styles.title}>{trip.title}</Text>

            {statusText && <Text style={styles.dDay}>{statusText}</Text>}

        <Text style={styles.date}>
            {trip.startDate} - {trip.endDate}
        </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.grayscale[200],
        borderRadius: 13,
        borderLeftWidth: 6,
        paddingLeft: 16,
        paddingVertical: 16,
        marginBottom: 17,
        shadowColor: colors.grayscale[1000],
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },

    title: { fontSize: 16, fontWeight: '600', fontFamily: 'Pretendard-Medium', },
    dDay: { fontSize: 15, color: '#769FFF', marginVertical: 2 },
    date: { fontSize: 13, color: colors.grayscale[700], marginVertical: 4 }
});