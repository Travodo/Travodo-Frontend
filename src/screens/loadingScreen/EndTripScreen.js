import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import TripCard from '../../components/TripCard';
import { colors } from '../../styles/colors';
import TravodoLogo from '../../../assets/Logo/TravodoLogo.svg';

function EndTripScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>여행 정보를 불러올 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TravodoLogo width={140} height={40} />

      <Text style={styles.title}>여행 기록 완료!</Text>
      <Text style={styles.subText}>
        잊지 못할 추억을 커뮤니티에 공유해보세요.
      </Text>

      <View style={styles.cardWrapper}>
        <TripCard trip={trip} hideActions={true} />
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.shareButton}>
          <Text style={styles.shareText}>공유하기</Text>
        </Pressable>

        <Pressable
          style={styles.skipButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 160,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 24,
    marginBottom: 8,
    color: colors.primary[600],
  },

  subText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[600],
    textAlign: 'center',
    marginBottom: 28,
  },

  cardWrapper: {
    width: '100%',
    marginBottom: 32,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 32,
  },

  shareButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },

  shareText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },

  skipButton: {
    backgroundColor: colors.grayscale[300],
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },

  skipText: {
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },

  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[600],
  },
});

export default EndTripScreen;