import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../styles/colors';
import Button from '../../components/Button';
import TripCard from '../../components/TripCard';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(size * scale);

export default function TravelCompleteScreen({ route, navigation }) {
  const { tripData } = route.params || {};
  const { name, destination, startDate, endDate, code } = tripData || {};

  const copyCode = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);

    Toast.show('✅ 초대 코드가 복사되었습니다!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM - 80,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: '#3C74D4',
      textColor: colors.grayscale[100],
      delay: 0,
    });
  };

  const dummyTrip = {
    title: name || '여행 이름',
    location: destination || '여행지',
    startDate: startDate || '2025.01.01',
    endDate: endDate || '2025.01.03',
    companions: ['나', '친구'],
    color: colors.primary[700],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 여행이 생성되었습니다!</Text>
      <Text style={styles.subtitle}>함께할 여행자들을 초대해볼까요?</Text>

      <View style={styles.cardWrapper}>
        <TripCard trip={dummyTrip} />
      </View>

      <Text style={styles.code}>{code}</Text>

      <Button text="초대 코드 복사하기" style={styles.copyButton} onPress={copyCode} />
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    alignItems: 'center',
    paddingTop: normalize(80),
    paddingHorizontal: normalize(24),
  },
  title: {
    fontSize: normalize(22),
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[1000],
    marginBottom: normalize(8),
    marginTop: normalize(20),
  },
  subtitle: {
    fontSize: normalize(16),
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[800],
    marginBottom: normalize(30),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale[200],
    padding: normalize(16),
    borderRadius: normalize(12),
    width: '100%',
    marginBottom: normalize(30),
  },
  dot: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: colors.primary[700],
    marginRight: normalize(10),
  },
  tripName: {
    fontSize: normalize(15),
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginBottom: normalize(4),
  },
  tripPeriod: {
    fontSize: normalize(13),
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[700],
  },
  code: {
    fontSize: normalize(38),
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[900],
    marginBottom: normalize(44),
    letterSpacing: 4,
  },
  copyButton: {
    width: '100%',
    marginBottom: normalize(14),
    paddingVertical: normalize(16),
  },
  skipButton: {
    backgroundColor: colors.grayscale[300],
    borderRadius: normalize(10),
    paddingVertical: normalize(16),
    alignItems: 'center',
    width: '100%',
  },
  skipText: {
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: normalize(15),
  },
  cardWrapper: {
    width: '100%',
    marginTop: normalize(20),
    marginBottom: normalize(40),
  },
});
