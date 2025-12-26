import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { View, StyleSheet, Text, ActivityIndicator, Pressable, Platform } from 'react-native';
import { colors } from '../../styles/colors';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import MyLocation from '../../../assets/ComponentsImage/MyLocation.svg';

const DUMMY_USERS = [
  {
    id: 1,
    name: '철수',
    myStatus: 'ongoing',
    latitude: 37.57,
    longitude: 126.975,
    color: '#FF5733',
  }, // 주황
  {
    id: 2,
    name: '영희',
    myStatus: 'upcoming',
    latitude: 37.565,
    longitude: 126.98,
    color: '#33FF57',
  },
  {
    id: 3,
    name: '민수',
    myStatus: 'finished',
    latitude: 37.56,
    longitude: 126.97,
    color: '#3357FF',
  },
  {
    id: 4,
    name: '지수',
    myStatus: 'ongoing',
    latitude: 37.568,
    longitude: 126.982,
    color: '#FF33F6',
  }, // 핑크
];

function Maps() {
  const [myLocation, setMyLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myStatus, setMyStatus] = useState('ongoing');
  const mapRef = useRef(null);

  const message = myStatus === 'ongoing' ? '여행 진행 중' : '여행이 시작되지 않았어요.';

  const fetchTripData = async () => {
    try {
      // get
    } catch (error) {
      console.error(error);
    }
  };

  const sendMyLocation = async (location) => {
    try {
      // post
    } catch (error) {
      // error
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
      alert('아직 위치를 못 찾았어요!');
    }
  };

  useEffect(() => {
    let myLocationSubscription = null;
    (async () => {
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
      }
    })();
    return () => {
      if (myLocationSubscription) {
        myLocationSubscription.remove();
      }
    };
  }, [myStatus]);

  if (isLoading) {
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
          latitude: myLocation ? myLocation.latitude : 37.4877, // 내 위치 없으면 성공회대
          longitude: myLocation ? myLocation.longitude : 126.8251,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        // iOS에서 PROVIDER_GOOGLE는 네이티브 GoogleMaps 설정이 필요합니다.
        // (설정 전에는 기본 Apple Maps 사용)
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {myStatus === 'ongoing' &&
          DUMMY_USERS.filter((user) => user.myStatus === 'ongoing').map((user) => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              title={user.name}
            >
              <View style={[styles.userLocationDot, { backgroundColor: user.color }]} />
            </Marker>
          ))}
      </MapView>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{message}</Text>
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
