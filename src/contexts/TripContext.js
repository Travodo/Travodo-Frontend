import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TripContext = createContext(null);
const ONGOING_TRIP_KEY = '@travodo/ongoingTrip';

export const TripProvider = ({ children }) => {
  const [ongoingTrip, setOngoingTrip] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 앱 시작 시 저장된 ONGOING 여행 불러오기
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(ONGOING_TRIP_KEY);
        if (stored) {
          const trip = JSON.parse(stored);
          console.log('[TripContext] 저장된 ONGOING 여행 복원:', trip.name);
          setOngoingTrip(trip);
        }
      } catch (error) {
        console.error('[TripContext] ONGOING 여행 불러오기 실패:', error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const startTrip = useCallback(async (trip) => {
    console.log('[TripContext] 여행 시작:', trip.name);
    const ongoingTripData = {
      ...trip,
      status: 'ONGOING',
      dDay: 0, // 진행 중이므로 D-Day는 0
    };
    setOngoingTrip(ongoingTripData);

    try {
      await AsyncStorage.setItem(ONGOING_TRIP_KEY, JSON.stringify(ongoingTripData));
      console.log('[TripContext] ONGOING 여행 저장 완료');
    } catch (error) {
      console.error('[TripContext] ONGOING 여행 저장 실패:', error);
    }
  }, []);

  const endTrip = useCallback(async () => {
    console.log('[TripContext] 여행 종료');
    setOngoingTrip(null);

    try {
      await AsyncStorage.removeItem(ONGOING_TRIP_KEY);
      console.log('[TripContext] ONGOING 여행 삭제 완료');
    } catch (error) {
      console.error('[TripContext] ONGOING 여행 삭제 실패:', error);
    }
  }, []);

  return (
    <TripContext.Provider value={{ ongoingTrip, startTrip, endTrip, isLoaded }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};
