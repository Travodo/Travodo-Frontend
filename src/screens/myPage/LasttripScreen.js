import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { pastTrips } from '../../data/TripList';
import { colors } from '../../styles/colors';
import { getRandomColor } from '../../styles/cardColors';
import TripCard from '../../components/TripCard';
import Dropdown from '../../components/Dropdown';
import { useNavigation } from '@react-navigation/native';

function LasttripScreen() {
  const navigation = useNavigation();

  const [sortOrder, setSortOrder] = useState('latest');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [coloredTrips, setColoredTrips] = useState([]);

  useEffect(() => {
    // [수정] pastTrips가 undefined일 경우 빈 배열([])을 사용하여 에러 방지
    const data = pastTrips || [];

    const tripsWithColors = data.map((trip) => {
      if (trip.color) {
        return trip;
      }

      return {
        ...trip,
        color: getRandomColor(),
      };
    });
    setColoredTrips(tripsWithColors);
  }, []);

  const sortedTrips = [...coloredTrips].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate.replace(/\./g, '-')) : new Date(0);
    const dateB = b.startDate ? new Date(b.startDate.replace(/\./g, '-')) : new Date(0);
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  const selectSortOrder = (order) => {
    setSortOrder(order);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} overScrollMode="never" bounces={false}>
        <View style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 8, marginTop: 20 }]}>지난 여행</Text>
          <Text style={styles.subTitle}>Travodo와 함께한 여행을 추억하세요!</Text>
        </View>
        <View style={styles.sortDropdownWrapper}>
          <Dropdown
            options={['최신순', '오래된순']}
            selectedOption={sortOrder === 'latest' ? '최신순' : '오래된순'}
            visible={dropdownVisible}
            onToggle={() => setDropdownVisible(!dropdownVisible)}
            onSelect={(option) => {
              setSortOrder(option === '최신순' ? 'latest' : 'oldest');
              setDropdownVisible(false);
            }}
            dropdownStyle={{ width: 110, top: 35 }}
          />
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.cardList}>
          {sortedTrips.map((trip, i) => (
            <TripCard key={i} trip={trip} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default LasttripScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayscale[100] },
  content: { paddingHorizontal: 20, paddingBottom: 30 },

  sectionTitle: {
    fontSize: 20,
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
  },

  subTitle: {
    fontSize: 16,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Regular',
    marginBottom: 30,
  },

  sortDropdownWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    zIndex: 10,
    marginBottom: 0,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  sortText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
  },

  dropdown: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    overflow: 'hidden',
    marginTop: 1,
    top: '100%',
    left: 0,
    right: 20,
    width: 105,
    zIndex: 10,
    elevation: 4,
    backgroundColor: colors.primary[100],
  },

  dropdownText: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[800],
    fontSize: 14,
  },

  activeText: {
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    backgroundColor: colors.primary[100],
  },

  sectionDivider: {
    height: 2,
    backgroundColor: colors.grayscale[400],
    marginTop: 8,
    marginBottom: 16,
  },

  cardList: { marginTop: 6 },
});
