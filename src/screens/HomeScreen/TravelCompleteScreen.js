import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import Button from '../../components/Button';
import TripCard from '../../components/TripCard';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

function TravelCompleteScreen({ route, navigation }) {
  const navigation = useNavigation();
  
  const { tripData } = route.params || {};
  const { name, destination, startDate, endDate, code, color } = tripData || {};

  const copyCode = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    Toast.show({
      type: 'success',
      text1: '복사 완료',
      text2: '클립보드에 복사되었습니다',
      text1Style: { fontSize: 16 },
      text2Style: { fontSize: 13 },
    });
  };

  const dummyTrip = {
    title: name || '여행 이름',
    location: destination || '여행지',
    startDate: startDate || '2025.01.01',
    endDate: endDate || '2025.01.03',
    companions: Array.isArray(tripData.companions)
      ? tripData.companions
      : typeof tripData.companions === 'string'
        ? tripData.companions
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
        : ['나', '친구'],

    color: color || colors.primary[700],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 여행이 생성되었습니다!</Text>
      <Text style={styles.subtitle}>함께할 여행자들을 초대해볼까요?</Text>

      <View style={styles.cardWrapper}>
        <TripCard trip={dummyTrip} />
      </View>

      <Text style={styles.code}>{code}</Text>

      <TouchableOpacity activeOpacity={0.7} style={styles.copyButton} onPress={copyCode}>
        <Text style={styles.copyText}>초대 코드 복사하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('Home', { tripData })}
      >
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TravelCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[1000],
    marginBottom: 8,
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[800],
    marginBottom: 30,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale[200],
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[700],
    marginRight: 10,
  },

  tripName: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginBottom: 4,
  },

  tripPeriod: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[700],
  },

  code: {
    fontSize: 38,
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[900],
    marginBottom: 47,
    letterSpacing: 4,
  },

  copyButton: {
    backgroundColor: colors.primary[700],
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 6,
  },

  copyText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },

  skipButton: {
    backgroundColor: colors.grayscale[300],
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },

  skipText: {
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },

  cardWrapper: {
    width: '100%',
    marginTop: 20,
    marginBottom: 40,
  },
});
