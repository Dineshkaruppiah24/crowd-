// src/hooks/use-location.tsx
'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useToast } from './use-toast';

interface LocationContextType {
  location: { lat: number; lng: number } | null;
  error: string | null;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  error: null,
  isLoading: true,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
          setError(null);
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          const errorMessage =
            'Could not retrieve your location. Please enable location services.';
          setError(errorMessage);
          setIsLoading(false);
          // Fallback to a default location
          setLocation({ lat: 34.0522, lng: -118.2437 });
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: `${errorMessage} Showing default location.`,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      const errorMessage = 'Geolocation is not supported by your browser.';
      setError(errorMessage);
      setIsLoading(false);
      // Fallback to a default location
      setLocation({ lat: 34.0522, lng: -118.2437 });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [toast]);

  return (
    <LocationContext.Provider value={{ location, error, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};
