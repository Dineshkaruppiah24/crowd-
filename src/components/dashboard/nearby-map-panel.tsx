
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
import { ExternalLink, MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/use-location';
import { Button } from '../ui/button';

export function NearbyMapPanel() {
  const { location: center, isLoading, error } = useLocation();

  const handleOpenInGoogleMaps = () => {
    if (center) {
      const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Map
          </CardTitle>
          {center && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInGoogleMaps}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Google Maps
            </Button>
          )}
        </div>
        <CardDescription>
          Your current location and surroundings.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 p-0">
        {(isLoading || error) && <Skeleton className="h-full w-full" />}
        {!isLoading && !error && center && (
          <GoogleMapWrapper center={center} crowdDensityData={[]} />
        )}
      </CardContent>
    </Card>
  );
}
