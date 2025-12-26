import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import CodeInput from '../../components/CodeInput';
import { colors } from '../../styles/colors';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { joinTripByInviteCode } from '../../services/api';

function JoinScreen() {
  const navigation = useNavigation();
  
  const [code, setCode] = useState('');
  const CODE_LENGTH = 5;
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (joining) return;
    if (code.length !== CODE_LENGTH) return;

    try {
      setJoining(true);
      const trip = await joinTripByInviteCode(code); // TripResponse
      const toDotDate = (d) => String(d || '').replace(/-/g, '.');

      const tripData = {
        id: trip?.id,
        name: trip?.name,
        destination: trip?.place,
        place: trip?.place,
        startDate: toDotDate(trip?.startDate),
        endDate: toDotDate(trip?.endDate),
        color: trip?.color,
        status: trip?.status,
        companions: [],
      };

      // JoinScreen은 TripStack 내부이므로 PrepareScreen으로 바로 이동
      navigation.replace('PrepareScreen', { tripData });
    } catch (e) {
      console.error('여행 참가 실패:', e);
      Alert.alert('실패', '여행 참가에 실패했습니다. 초대코드를 확인해주세요.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} overScrollMode="never">
        <View style={styles.container}>
          <Text style={styles.title}>코드 입력</Text>
          <Text style={styles.sub}>참가하실 여행 초대 코드를 입력하세요!</Text>

          <CodeInput value={code} onChange={setCode} />

          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Button text={joining ? '참가 중...' : '참가하기'} onPress={handleJoin} disabled={joining} />
          </View>

          <TouchableOpacity
            style={[styles.button, code.length !== CODE_LENGTH && { opacity: 0.5 }]}
            disabled={code.length !== CODE_LENGTH || joining}
            onPress={handleJoin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default JoinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
    backgroundColor: colors.grayscale[100],
  },

  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 6,
  },

  sub: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[900],
    marginBottom: 75,
    textAlign: 'center',
  },
});
