// src/components/dashboard/nearby-map-panel.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleMapWrapper } from './google-map-wrapper';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

export function NearbyMapPanel() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setIsLoading(false);
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          setError('Could not retrieve your location. Please enable location services in your browser.');
          setIsLoading(false);
          // Fallback location
          setCenter({ lat: 34.0522, lng: -118.2437 });
           toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not retrieve your location. Showing default location.',
          });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      // Fallback location
      setCenter({ lat: 34.0522, lng: -118.2437 });
    }
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Map
        </CardTitle>
        <CardDescription>Your current location and surroundings.</CardDescription>
      </CardHeader>
      <CardContent className="h-80 p-0">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && !isLoading && (
            <div className="flex items-center justify-center h-full p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )}
        {!isLoading && center && (
          <GoogleMapWrapper
            center={center}
            crowdDensityData={[]}
          />
        )}
      </CardContent>
    </Card>
  );
}
