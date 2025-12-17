import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TripCard from '../../components/TripCard';
import { colors } from '../../styles/colors';

function PrepareScreen({ route }) {
  const trip = route?.params?.trip;

  return (
    <ScrollView
      style={styles.container}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      {trip && (
        <View style={styles.stickyWrapper}>
          <TripCard trip={trip} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>공동 준비물</Text>
        <PrepareItem text="여권" />
        <PrepareItem text="항공권" />

        <Text style={styles.sectionTitle}>개인 준비물</Text>
        <PrepareItem text="세면도구" />
        <PrepareItem text="충전기" />
      </View>
    </ScrollView>
  );
}

export default PrepareScreen;

function PrepareItem({ text }) {
  return (
    <View style={styles.item}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  stickyWrapper: {
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 20,
    paddingTop: 12,
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
    marginVertical: 12,
  },

  item: {
    backgroundColor: colors.grayscale[200],
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
});
