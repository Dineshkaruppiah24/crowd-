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
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function NearbyMapPanel() {
  const { location: center, isLoading, error } = useLocation();
  const mapPlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );

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
        {(isLoading || error) && mapPlaceholder && (
          <div className="relative h-full w-full">
            <Image
              src={mapPlaceholder.imageUrl}
              alt={mapPlaceholder.description}
              data-ai-hint={mapPlaceholder.imageHint}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-white/80">Loading map...</p>
            </div>
          </div>
        )}
        {!isLoading && !error && center && (
          <GoogleMapWrapper center={center} crowdDensityData={[]} />
        )}
      </CardContent>
    </Card>
  );
}
