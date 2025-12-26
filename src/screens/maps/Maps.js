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

  const loadInitialData = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const { gpsAgree } = savedSettings ? JSON.parse(savedSettings) : { gpsAgree: false };
      setGpsConsent(gpsAgree);

      const currentData = await getCurrentTrip();
      if (currentData?.id) {
        setOngoingTrip(currentData);
        setMyStatus('ongoing');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, []),
  );

  useEffect(() => {
    let subscription = null;
    let interval = null;

    const startTracking = async () => {
      // 1. GPS 동의 + 여행 중일 때만 내 위치 추적
      if (myStatus === 'ongoing' && gpsConsent) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 10 },
            (loc) => {
              setMyLocation(loc.coords);
              updateMyLocation(ongoingTrip.id, loc.coords);
            },
          );
        }
      }

      // 2. 팀원 위치는 내 GPS 동의 여부와 상관없이 가져옴
      if (myStatus === 'ongoing') {
        fetchMemberLocations();
        interval = setInterval(fetchMemberLocations, 10000);
      }
    };

    startTracking();
    return () => {
      subscription?.remove();
      if (interval) clearInterval(interval);
    };
  }, [myStatus, gpsConsent, ongoingTrip]);

  const fetchMemberLocations = async () => {
    if (!ongoingTrip?.id) return;
    try {
      const data = await getMemberLocations(ongoingTrip.id);
      setMembers(Array.isArray(data) ? data.filter((m) => m.latitude !== 0) : []);
    } catch (e) {
      console.error(e);
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

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

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
            <Marker key={m.memberId} coordinate={{ latitude: m.latitude, longitude: m.longitude }}>
              <View
                style={[
                  styles.userLocationDot,
                  { backgroundColor: m.color || colors.primary[700] },
                ]}
              />
            </Marker>
          ))}
      </MapView>
      <Pressable onPress={moveToCurrentLocation} style={styles.button}>
        <MyLocation width={18} height={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
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
  userLocationDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: '#fff' },
});

export default Maps;
