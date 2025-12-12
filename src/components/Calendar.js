import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../styles/colors';

export default function CalendarView({ selectedRange }) {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return;

    const [start, end] = selectedRange;
    const startDate = new Date(start.replace(/\./g, '-'));
    const endDate = new Date(end.replace(/\./g, '-'));
    const temp = {};

    let current = new Date(startDate);
    while (current <= endDate) {
      const key = current.toISOString().split('T')[0];
      temp[key] = { color: '#3C74D4', textColor: 'white' };
      current.setDate(current.getDate() + 1);
    }
    setMarkedDates(temp);
  }, [selectedRange]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={markedDates}
        markingType="period"
        theme={{
          todayTextColor: '#3C74D4',
          backgroundColor: colors.grayscale[200],
          calendarBackground: colors.grayscale[200],
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
        }}
      />
    </View>
  );
}
