import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../styles/colors';

export default function CalendarView({ trips = [], selectedRange }) {
  const markedDates = useMemo(() => {
    const marks = {};

    if (Array.isArray(trips) && trips.length > 0) {
      trips.forEach((trip) => {
        if (!trip.startDate || !trip.endDate) return;

        const startDate = new Date(trip.startDate.replace(/\./g, '-'));
        const endDate = new Date(trip.endDate.replace(/\./g, '-'));
        const color = trip.color || colors.primary[800];

        let current = new Date(startDate);
        while (current <= endDate) {
          const key = current.toISOString().split('T')[0];
          marks[key] = { color, textColor: 'white' };
          current.setDate(current.getDate() + 1);
        }

        const startKey = startDate.toISOString().split('T')[0];
        const endKey = endDate.toISOString().split('T')[0];
        const isSingleDay = startKey === endKey;

        if (isSingleDay) {
          marks[startKey] = {
            startingDay: true,
            endingDay: true,
            color,
            textColor: colors.grayscale[100],
          };
        } else {
          marks[startKey] = {
            startingDay: true,
            color,
            textColor: colors.grayscale[100],
          };

          marks[endKey] = {
            endingDay: true,
            color,
            textColor: colors.grayscale[100],
          };
        }
      });
    }

    if (selectedRange?.start && selectedRange?.end) {
      const startDate = new Date(selectedRange.start.replace(/\./g, '-'));
      const endDate = new Date(selectedRange.end.replace(/\./g, '-'));

      let current = new Date(startDate);
      while (current <= endDate) {
        const key = current.toISOString().split('T')[0];
        marks[key] = {
          color: colors.primary[800],
          textColor: 'white',
        };
        current.setDate(current.getDate() + 1);
      }

      const startKey = startDate.toISOString().split('T')[0];
      const endKey = endDate.toISOString().split('T')[0];
      const isSingleDay = startKey === endKey;

      if (isSingleDay) {
        marks[startKey] = {
          startingDay: true,
          endingDay: true,
          color: colors.primary[800],
          textColor: colors.grayscale[100],
        };
      } else {
        marks[startKey] = {
          startingDay: true,
          color: colors.primary[800],
          textColor: colors.grayscale[100],
        };

        marks[endKey] = {
          endingDay: true,
          color: colors.primary[800],
          textColor: colors.grayscale[100],
        };
      }
    }

    return marks;
  }, [trips, selectedRange?.start, selectedRange?.end]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={markedDates}
        markingType="period"
        theme={{
          todayTextColor: colors.primary[800],
          backgroundColor: colors.grayscale[200],
          calendarBackground: colors.grayscale[200],
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          arrowColor: colors.primary[800],
        }}
      />
    </View>
  );
}
