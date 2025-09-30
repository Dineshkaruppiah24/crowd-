// src/components/dashboard/nearby-map-panel.tsx
'use client';

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
import { useLocation } from '@/hooks/use-location';

export function NearbyMapPanel() {
  const { location: center, isLoading, error } = useLocation();

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
