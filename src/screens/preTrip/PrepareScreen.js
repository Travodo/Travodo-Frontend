import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import TripCard from '../../components/TripCard';
import { colors } from '../../styles/colors';
import { upcomingTrips } from '../../data/TripList';
import ChecklistItem from '../../components/Checklist';
import TravelerAvatar from '../../components/TravelerAvatar';

function PrepareScreen() {
  const trip = upcomingTrips[0];
  const travelers = [
    { id: 1, name: '홍길동', color: '#6B8EFF' },
    { id: 2, name: '유병재', color: '#FFD66B' },
    { id: 3, name: '차은우', color: '#FF8A8A' },
    { id: 4, name: '이수근', color: '#9AD77D' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.pageTitle, { marginBottom: 6 }]}>여행 준비 리스트</Text>
      <Text style={styles.subTitle}>신나는 여행을 준비해 봐요!</Text>
      <View style={styles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>여행자</Text>

        <View style={styles.travelerRow}>
          {travelers.map((traveler) => (
            <TravelerAvatar key={traveler.id} name={traveler.name} color={traveler.color} />
          ))}
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>공동 준비물</Text>

        <View style={styles.list}>
          <ChecklistItem content="여권" name="공동" />
          <ChecklistItem content="항공권" name="공동" />
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>개인 준비물</Text>

        <View style={styles.list}>
          <ChecklistItem content="여권" name="차은우" />
          <ChecklistItem content="항공권" name="이수근" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrepareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  pageTitle: {
    fontSize: 20,
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 20,
  },

  subTitle: {
    fontSize: 16,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Regular',
    marginBottom: 4,
    paddingHorizontal: 20,
  },

  fixedCard: {
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 8,
    zIndex: 10,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 12,
    color: colors.grayscale[1000],
  },

  list: {
    gap: 10,
  },

  sectionDivider: {
    height: 1.2,
    backgroundColor: colors.grayscale[400],
    marginTop: 28,
    marginBottom: 16,
  },

  travelerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayscale[300],
    alignItems: 'center',
    justifyContent: 'center',
  },

  addText: {
    fontSize: 22,
    color: colors.grayscale[500],
    fontWeight: '500',
  },
});
