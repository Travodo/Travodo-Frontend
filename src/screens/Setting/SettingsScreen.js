import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import SettingItem from '../../components/SettingItem';
import { colors } from '../../styles/colors';

const SETTINGS_KEY = '@user_settings';

function SettingsScreen({ navigation }) {
  const [dDayAlarm, setDdayAlarm] = useState(false);
  const [updateAlarm, setUpdateAlarm] = useState(false);
  const [adAlarm, setAdAlarm] = useState(false);
  const [gpsAgree, setGpsAgree] = useState(false);
  const [rotateLock, setRotateLock] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // 1. 헤더 설정
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          style={[styles.headerButton, { transform: [{ rotate: '-45deg' }] }]}
          onPress={() => navigation.goBack()}
        />
      ),
    });

    // 2. 초기 데이터 로드
    loadSettings();

    // 3. 앱이 배경에서 돌아올 때 권한 다시 체크
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkPermissions();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // [데이터 불러오기]
  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        setUpdateAlarm(settings.updateAlarm || false);
        setAdAlarm(settings.adAlarm || false);
        setRotateLock(settings.rotateLock || false);
        setGpsAgree(settings.gpsAgree || false);
      }
      checkPermissions(); // 실제 시스템 권한 상태와 동기화
    } catch (e) {
      console.error('불러오기 실패', e);
    }
  };

  // [데이터 저장하기]
  const saveSettings = async (key, value) => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = saved ? JSON.parse(saved) : {};
      settings[key] = value;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('저장 실패', e);
    }
  };

  // [권한 상태 체크]
  const checkPermissions = async () => {
    const { status: authStatus } = await Notifications.getPermissionsAsync();
    setDdayAlarm(authStatus === 'granted');

    const { status: locStatus } = await Location.getForegroundPermissionsAsync();
    // 시스템 권한이 꺼져있으면 앱 내 스위치도 강제로 끔
    if (locStatus !== 'granted') {
      setGpsAgree(false);
      saveSettings('gpsAgree', false);
    }
  };

  // [GPS 토글 처리]
  const handleGPSToggle = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus === 'granted') {
        setGpsAgree(true);
        saveSettings('gpsAgree', true);
      } else {
        Alert.alert('권한 필요', '설정에서 위치 권한을 허용해주세요.', [
          { text: '취소', style: 'cancel' },
          { text: '설정 이동', onPress: () => Linking.openSettings() },
        ]);
      }
    } else {
      const nextValue = !gpsAgree;
      setGpsAgree(nextValue);
      saveSettings('gpsAgree', nextValue);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} bounces={false} overScrollMode="never">
        <Text style={[styles.sectionTitle, { marginBottom: 8, marginTop: 20 }]}>계정 정보</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="내 프로필"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'ProfileScreen' })}
        />
        <SettingItem
          label="지난 여행 관리"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'LasttripScreen' })}
        />
        <SettingItem
          label="내가 쓴 글"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'MyWriteTrip' })}
        />

        <Text style={styles.sectionTitle}>알림</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="D-day 알림"
          type="toggle"
          value={dDayAlarm}
          onToggle={() => {}} // 시스템 권한이므로 단순 클릭 방지 혹은 알림 유도
        />
        <SettingItem
          label="공지/업데이트 알림"
          type="toggle"
          value={updateAlarm}
          onToggle={() => {
            const next = !updateAlarm;
            setUpdateAlarm(next);
            saveSettings('updateAlarm', next);
          }}
        />
        <SettingItem
          label="야간 광고성 알림"
          type="toggle"
          value={adAlarm}
          onToggle={() => {
            const next = !adAlarm;
            setAdAlarm(next);
            saveSettings('adAlarm', next);
          }}
        />

        <Text style={styles.sectionTitle}>서비스</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="GPS 사용 동의"
          type="toggle"
          value={gpsAgree}
          onToggle={handleGPSToggle}
        />
        <SettingItem
          label="지도 회전 방지"
          type="toggle"
          value={rotateLock}
          onToggle={() => {
            const next = !rotateLock;
            setRotateLock(next);
            saveSettings('rotateLock', next);
          }}
        />
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingTop: Platform.OS === 'android' ? 60 : 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.grayscale[1000],
    marginTop: 40,
    marginBottom: 8,
    fontFamily: 'Pretendard-SemiBold',
    paddingLeft: 5,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: colors.grayscale[400],
    marginTop: 3,
  },
  headerButton: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#000',
    width: 13,
    height: 13,
    marginLeft: 15,
  },
});
