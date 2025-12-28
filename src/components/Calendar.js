import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

const toDateKey = (dateString) => {
  const [y, m, d] = dateString.split('.').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

export default function CalendarView({ trips = [], selectedRange }) {
  const markedDates = useMemo(() => {
    const marks = {};

    const markPeriod = (start, end, color) => {
      const startKey = toDateKey(start);
      const endKey = toDateKey(end);

      if (startKey === endKey) {
        marks[startKey] = {
          startingDay: true,
          endingDay: true,
          color,
          textColor: colors.grayscale[100],
        };
        return;
      }

      let current = new Date(start.replace(/\./g, '-'));
      const endDate = new Date(end.replace(/\./g, '-'));

      while (current <= endDate) {
        const key = current.toISOString().split('T')[0];
        marks[key] = {
          color,
          textColor: 'white',
        };
        current.setDate(current.getDate() + 1);
      }

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
    };

    trips.forEach((trip) => {
      if (!trip.startDate || !trip.endDate) return;
      markPeriod(trip.startDate, trip.endDate, trip.color || colors.primary[800]);
    });

    if (selectedRange?.start && selectedRange?.end) {
      markPeriod(selectedRange.start, selectedRange.end, colors.primary[800]);
    }

    return marks;
  }, [trips, selectedRange?.start, selectedRange?.end]);

  return (
    <View>
      <Calendar
        markingType="period"
        markedDates={markedDates}
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

CalendarView.propTypes = {
  trips: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
  selectedRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
};
