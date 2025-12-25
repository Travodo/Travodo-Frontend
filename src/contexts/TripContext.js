import { createContext, useContext, useState } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripStatus, setTripStatus] = useState('BEFORE'); 

  const startTrip = () => setTripStatus('ONGOING');
  const endTrip = () => setTripStatus('DONE');

  return (
    <TripContext.Provider
      value={{
        tripStatus,
        startTrip,
        endTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
