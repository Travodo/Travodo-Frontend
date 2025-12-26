import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../../styles/colors';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyLocation from '../../../assets/ComponentsImage/MyLocation.svg';
import { updateMyLocation, getMemberLocations, getCurrentTrip } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const SETTINGS_KEY = '@user_settings';

function Maps() {
  const [myLocation, setMyLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myStatus, setMyStatus] = useState('');
  const [members, setMembers] = useState([]);
  const [ongoingTrip, setOngoingTrip] = useState(null);
  const [gpsConsent, setGpsConsent] = useState(false);

  const mapRef = useRef(null);

  const message = myStatus === 'ongoing' ? '여행 진행 중' : '여행이 시작되지 않았어요.';

  // 1. API로부터 현재 여행 정보를 가져와 ID 추출
  const loadInitialData = async () => {
    try {
      // GPS 동의 여부는 설정값(AsyncStorage)에서 가져옴
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const { gpsAgree } = savedSettings ? JSON.parse(savedSettings) : { gpsAgree: false };
      setGpsConsent(gpsAgree);

      // [API 호출] 현재 진행 중인 여행 확인
      const currentData = await getCurrentTrip();

      if (currentData && currentData.id) {
        // 성공적으로 ID를 받아온 경우
        setOngoingTrip(currentData);
        setMyStatus('ongoing');
        console.log('[Maps] 현재 여행 ID:', currentData.id);
      } else {
        setOngoingTrip(null);
        setMyStatus('');
      }
    } catch (error) {
      console.error('[Maps] 데이터 로드 실패:', error);
      setOngoingTrip(null);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, []),
  );

  // 2. 여행 ID를 기반으로 위치 추적 및 팀원 위치 조회
  useEffect(() => {
    let subscription = null;
    let interval = null;

    // ongoingTrip.id가 있을 때만 실행
    const tripId = ongoingTrip?.id;

    const startTracking = async () => {
      if (!tripId) return; // ID가 없으면 아무것도 하지 않음

      // [내 위치 전송] GPS 동의했을 때만 실행
      if (gpsConsent) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 10 },
            (loc) => {
              setMyLocation(loc.coords);
              // 추출한 tripId를 전달하여 내 위치 업데이트
              updateMyLocation(tripId, loc.coords);
            },
          );
        }
      }

      // [팀원 위치 조회] 추출한 tripId를 전달
      fetchMemberLocations(tripId);
      interval = setInterval(() => fetchMemberLocations(tripId), 10000);
    };

    startTracking();

    return () => {
      subscription?.remove();
      if (interval) clearInterval(interval);
    };
  }, [ongoingTrip?.id, gpsConsent]); // ID가 바뀔 때마다 트래킹 재설정

  // 팀원 위치 불러오기 함수 (매개변수로 tripId를 받음)
  const fetchMemberLocations = async (id) => {
    if (!id) return;
    try {
      const data = await getMemberLocations(id);
      // 서버 응답에서 유효한 위치 정보만 필터링
      setMembers(
        Array.isArray(data) ? data.filter((m) => m.latitude !== 0 && m.longitude !== 0) : [],
      );
    } catch (e) {
      console.error('[Maps] 팀원 위치 조회 실패:', e);
    }
  };

  const moveToCurrentLocation = () => {
    if (!gpsConsent) return Alert.alert('알림', '설정에서 GPS 동의를 켜주세요.');
    if (myLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary[700]} />;

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={gpsConsent}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {myStatus === 'ongoing' &&
          members.map((m) => (
            <Marker
              key={m.memberId}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.nickname}
            >
              <View
                style={[
                  styles.userLocationDot,
                  { backgroundColor: m.color || colors.primary[700] },
                ]}
              />
            </Marker>
          ))}
      </MapView>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{message}</Text>
        {ongoingTrip && <Text style={[styles.text, { fontSize: 12 }]}>{ongoingTrip.name}</Text>}
      </View>

      <Pressable onPress={moveToCurrentLocation} style={styles.button}>
        <MyLocation width={18} height={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  textContainer: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.primary[700],
    borderRadius: 50,
    position: 'absolute',
    left: 12,
    top: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  userLocationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
  },
});

export default Maps;
