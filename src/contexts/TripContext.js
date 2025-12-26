import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState({}); // { [tripId]: 'BEFORE' | 'ONGOING' | 'DONE' }
  const [isLoaded, setIsLoaded] = useState(false);

  // 앱 시작 시 저장된 여행 상태 불러오기
  useEffect(() => {
    loadTripStatuses();
  }, []);

  const loadTripStatuses = async () => {
    try {
      const saved = await AsyncStorage.getItem('tripStatuses');
      if (saved) {
        setTrips(JSON.parse(saved));
      }
    } catch (e) {
      console.error('여행 상태 로드 실패:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTripStatuses = async (newTrips) => {
    try {
      await AsyncStorage.setItem('tripStatuses', JSON.stringify(newTrips));
    } catch (e) {
      console.error('여행 상태 저장 실패:', e);
    }
  };

  // 특정 여행의 상태 가져오기
  const getTripStatus = (tripId) => {
    return trips[tripId] || 'BEFORE';
  };

  // 여행 시작
  const startTrip = (tripId) => {
    const newTrips = { ...trips, [tripId]: 'ONGOING' };
    setTrips(newTrips);
    saveTripStatuses(newTrips);
  };

  // 여행 종료
  const endTrip = (tripId) => {
    const newTrips = { ...trips, [tripId]: 'DONE' };
    setTrips(newTrips);
    saveTripStatuses(newTrips);
  };

  // 여행 상태 초기화 (삭제 시)
  const resetTrip = (tripId) => {
    const newTrips = { ...trips };
    delete newTrips[tripId];
    setTrips(newTrips);
    saveTripStatuses(newTrips);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        isLoaded,
        getTripStatus,
        startTrip,
        endTrip,
        resetTrip,
      }}
    >
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