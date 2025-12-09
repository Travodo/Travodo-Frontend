import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { pastTrips } from '../HomeScreen/TripList';
import { colors } from '../../styles/colors';
import TripCard from '../../components/TripCard';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

export default function LasttripScreen() {
  const [sortOrder, setSortOrder] = useState('latest');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const sortedTrips = [...pastTrips].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate.replace(/\./g, '-')) : new Date(0);
    const dateB = b.startDate ? new Date(b.startDate.replace(/\./g, '-')) : new Date(0);
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  const selectSortOrder = (order) => {
    setSortOrder(order);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { marginBottom: 8, marginTop: 20 }]}>지난 여행</Text>
          <Text style={styles.subTitle}>Travodo와 함께한 여행을 추억하세요!</Text>
        </View>

        <View style={styles.sortDropdownWrapper}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.sortText}>
              {sortOrder === 'latest' ? '최신순' : '오래된순'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={22} color={colors.grayscale[800]} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdown}>
              <Pressable onPress={() => selectSortOrder('latest')}>
                <Text
                  style={[
                    styles.dropdownText,
                    sortOrder === 'latest' && styles.activeText,
                  ]}
                >
                  최신순
                </Text>
              </Pressable>

              <Pressable onPress={() => selectSortOrder('oldest')}>
                <Text
                  style={[
                    styles.dropdownText,
                    sortOrder === 'oldest' && styles.activeText,
                  ]}
                >
                  오래된순
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.sectionDivider} />
        <View style={styles.cardList}>
          {sortedTrips.map((trip, i) => (
            <TripCard key={i} trip={trip} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayscale[100] },
  content: { paddingHorizontal: normalize(20), paddingBottom: normalize(30) },

  sectionTitle: {
    fontSize: normalize(24),
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
  },

  subTitle: {
    fontSize: normalize(16),
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Medium',
    marginBottom: normalize(30),
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
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
  },

  sortText: {
    fontSize: normalize(15),
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
  },

  dropdown: {
    position: 'absolute',
    borderRadius: normalize(6),
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    overflow: 'hidden',
    marginTop: normalize(1),
    top: '100%',
    left: 0,
    right: 20,
    width: normalize(105),
    zIndex: 10,
    elevation: 4,
    backgroundColor: colors.primary[100],
  },

  dropdownText: {
    paddingVertical: normalize(9),
    paddingHorizontal: normalize(18),
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[800],
    fontSize: normalize(14),
  },

  activeText: {
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    backgroundColor: colors.primary[100],
  },

  sectionDivider: {
    height: normalize(2),
    backgroundColor: colors.grayscale[400],
    marginTop: normalize(12),
    marginBottom: normalize(16),
  },

  cardList: { marginTop: normalize(6) },
});
