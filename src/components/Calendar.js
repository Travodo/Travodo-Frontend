import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../styles/colors';

function getPrevDateStr(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getNextDateStr(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function CalendarView() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const rebuildMarkedDates = (dates) => {
    const sorted = [...dates].sort(); 
    const set = new Set(sorted);
    const marked = {};

    sorted.forEach((date) => {
      const prev = getPrevDateStr(date);
      const next = getNextDateStr(date);

      const hasPrev = set.has(prev);
      const hasNext = set.has(next);

      if (!hasPrev && !hasNext) {
    
        marked[date] = {
          startingDay: true,
          endingDay: true,
          color: '#3C74D4',
          textColor: 'white',
        };
      } else if (!hasPrev && hasNext) {
   
        marked[date] = {
          startingDay: true,
          color: '#3C74D4',
          textColor: 'white',
        };
      } else if (hasPrev && !hasNext) {
    
        marked[date] = {
          endingDay: true,
          color: '#3C74D4',
          textColor: 'white',
        };
      } else {
        marked[date] = {
          color: '#3C74D4',
          textColor: 'white',
        };
      }
    });

    setMarkedDates(marked);
  };

  const handleDayPress = (day) => {
    const date = day.dateString;

    let nextSelected;
    if (selectedDates.includes(date)) {
   
      nextSelected = selectedDates.filter((d) => d !== date);
    } else {
      nextSelected = [...selectedDates, date];
    }

    setSelectedDates(nextSelected);
    rebuildMarkedDates(nextSelected);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayscale[200], borderRadius: 18, overflow: 'hidden' }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="period" 
        theme={{
          todayTextColor: '#3C74D4',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          backgroundColor: colors.grayscale[200],
          calendarBackground: colors.grayscale[200],
          textSectionTitleColor: '#333',
        }}
      />
    </View>
  );
}
