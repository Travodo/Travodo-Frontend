import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../styles/colors';

export default function CalendarView({ selectedRange }) {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (!selectedRange || !selectedRange.start || !selectedRange.end) return;

    const { start, end } = selectedRange;
    const startDate = new Date(start.replace(/\./g, '-'));
    const endDate = new Date(end.replace(/\./g, '-'));
    const temp = {};

    let current = new Date(startDate);
    while (current <= endDate) {
      const key = current.toISOString().split('T')[0];
      temp[key] = { color: colors.primary[800], textColor: 'white' };
      current.setDate(current.getDate() + 1);
    }

    const startKey = startDate.toISOString().split('T')[0];
    const endKey = endDate.toISOString().split('T')[0];

    temp[startKey] = {
      startingDay: true,
      color: colors.primary[800],
      textColor: colors.grayscale[100],
    };

    temp[endKey] = {
      endingDay: true,
      color: colors.primary[800],
      textColor: colors.grayscale[100],
    };

    setMarkedDates(temp);
  }, [selectedRange]);

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
