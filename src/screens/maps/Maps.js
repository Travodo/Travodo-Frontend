import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { View, StyleSheet, Text, ActivityIndicator, Pressable, Platform } from 'react-native';
import { colors } from '../../styles/colors';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import MyLocation from '../../../assets/ComponentsImage/MyLocation.svg';
import { updateMyLocation, getMemberLocations } from '../../services/api';
import { useTrip } from '../../contexts/TripContext';

function Maps() {
  const [myLocation, setMyLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myStatus, setMyStatus] = useState('');
  const [members, setMembers] = useState([]);

  const { ongoingTrip, isLoaded: isContextLoaded } = useTrip();
  const mapRef = useRef(null);

  const message = myStatus === 'ongoing' ? '여행 진행 중' : '여행이 시작되지 않았어요.';

  useEffect(() => {
    if (ongoingTrip) {
      setMyStatus('ongoing');
    } else {
      setMyStatus('');
    }
  }, [ongoingTrip]);

  const sendMyLocation = async (coords) => {
    if (!ongoingTrip || !ongoingTrip.id) return;

    try {
      const { latitude, longitude } = coords;
      await updateMyLocation(ongoingTrip.id, { latitude, longitude });
    } catch (error) {
      console.error('위치 전송 실패', error);
    }
  };

  const fetchMemberLocations = async () => {
    if (!ongoingTrip || !ongoingTrip.id) return;

    try {
      const data = await getMemberLocations(ongoingTrip.id);
      const validMembers = Array.isArray(data)
        ? data.filter((m) => m.latitude !== 0 && m.longitude !== 0)
        : [];
      setMembers(validMembers);
    } catch (error) {
      console.error('팀원 위치 조회 실패:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('위치 접근 허용이 필요합니다.');
          setIsLoading(false);
          return;
        }

        let locationData = await Location.getLastKnownPositionAsync();

        if (!locationData) {
          locationData = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }

        setMyLocation(locationData.coords);
      } catch (error) {
        console.log('위치 로딩 에러:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const moveToCurrentLocation = () => {
    if (myLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500,
      );
    } else {
      if (isLoading) return;
      alert('아직 위치를 못 찾았어요!');
    }
  };

  useEffect(() => {
    let myLocationSubscription = null;
    let memberFetchInterval = null;

    const startTracking = async () => {
      if (myStatus === 'ongoing') {
        myLocationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setMyLocation(newLocation.coords);
            sendMyLocation(newLocation.coords);
          },
        );

        fetchMemberLocations();
        memberFetchInterval = setInterval(fetchMemberLocations, 10000);
      } else {
        setMembers([]);
      }
    };

    startTracking();

    return () => {
      if (myLocationSubscription) {
        myLocationSubscription.remove();
      }
      if (memberFetchInterval) {
        clearInterval(memberFetchInterval);
      }
    };
  }, [myStatus, ongoingTrip]);

  if (isLoading || !isContextLoaded) {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: myLocation ? myLocation.latitude : 37.4877,
          longitude: myLocation ? myLocation.longitude : 126.8251,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {myStatus === 'ongoing' &&
          members.map((member) => (
            <Marker
              key={member.memberId}
              coordinate={{
                latitude: member.latitude,
                longitude: member.longitude,
              }}
              title={member.nickname}
              description={member.nickname}
            >
              <View
                style={[
                  styles.userLocationDot,
                  { backgroundColor: member.color || colors.primary[700] },
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

export default Maps;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
    borderRadius: 50,
    position: 'absolute',
    right: 35,
    bottom: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLocationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
